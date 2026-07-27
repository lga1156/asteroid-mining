/**
 * XMLService - XML parsing service.
 * Parses CML (Chemical Markup Language) XML responses and extracts asteroid resources.
 */

import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { ContractViolation, ContractViolationError, ParsedResource } from '../types';

const CML_NAMESPACE = 'http://www.xml-cml.org/schema';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asArray(value: unknown): unknown[] {
    if (value === undefined) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function textContent(value: unknown): string | undefined {
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }
    if (
        isRecord(value) &&
        (typeof value['#text'] === 'string' || typeof value['#text'] === 'number')
    ) {
        return String(value['#text']);
    }
    return undefined;
}

function finiteNumber(value: string | undefined): number | undefined {
    if (value === undefined || value.trim() === '') {
        return undefined;
    }
    const result = Number(value);
    return Number.isFinite(result) ? result : undefined;
}

function elementKeys(value: Record<string, unknown>): string[] {
    return Object.keys(value).filter((key) => key !== ':@' && key !== '#text');
}

function localName(value: string): string {
    return value.replace(/^.*:/u, '');
}

function namespacesFor(
    value: Record<string, unknown>,
    inherited: Map<string, string> = new Map()
): Map<string, string> {
    const namespaces = new Map(inherited);
    const attributes = isRecord(value[':@']) ? value[':@'] : {};
    for (const [key, namespace] of Object.entries(attributes)) {
        if (key === 'xmlns' && typeof namespace === 'string') {
            namespaces.set('', namespace);
        } else if (key.startsWith('xmlns:') && typeof namespace === 'string') {
            namespaces.set(key.slice('xmlns:'.length), namespace);
        }
    }
    return namespaces;
}

function namespaceForElement(
    elementName: string,
    namespaces: Map<string, string>
): string | undefined {
    const separator = elementName.indexOf(':');
    const prefix = separator === -1 ? '' : elementName.slice(0, separator);
    return namespaces.get(prefix);
}

function validateElementNamespace(
    elementName: string,
    namespaces: Map<string, string>,
    path: string,
    violations: ContractViolation[]
): void {
    if (namespaceForElement(elementName, namespaces) !== CML_NAMESPACE) {
        violations.push({ path, message: `must use namespace ${CML_NAMESPACE}` });
    }
}

function validateKeys(
    value: Record<string, unknown>,
    allowedKeys: string[],
    path: string,
    violations: ContractViolation[]
): void {
    for (const key of Object.keys(value)) {
        if (!allowedKeys.includes(key)) {
            violations.push({ path: `${path}.${key}`, message: 'is not allowed' });
        }
    }
}

export class XMLService {
    private readonly parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        removeNSPrefix: true,
        parseTagValue: false,
        trimValues: true,
    });
    private readonly orderedParser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        removeNSPrefix: false,
        parseTagValue: false,
        preserveOrder: true,
        trimValues: true,
    });
    /**
     * Parse CML XML and extract resources as an array.
     * @param xml - CML XML string to parse
     * @returns Array of resources extracted from molecule elements
     */
    public parse(xml: string): ParsedResource[] {
        if (xml.trim() === '') {
            return [];
        }

        if (XMLValidator.validate(xml) !== true) {
            throw new ContractViolationError([{ path: '$', message: 'must be valid XML' }]);
        }

        const violations = this.validateDocumentStructure(xml);
        const parsed: unknown = this.parser.parse(xml);
        if (!isRecord(parsed)) {
            throw new ContractViolationError([{ path: '$.cml', message: 'is required' }]);
        }

        if (parsed.cml === '' || parsed.cml === null) {
            if (violations.length > 0) {
                throw new ContractViolationError(violations);
            }
            return [];
        }
        if (!isRecord(parsed.cml)) {
            throw new ContractViolationError([{ path: '$.cml', message: 'is required' }]);
        }
        validateKeys(parsed.cml, ['molecule', 'id', 'title'], '$.cml', violations);

        const resources: ParsedResource[] = [];
        for (const [index, moleculeValue] of asArray(parsed.cml.molecule).entries()) {
            const path = `$.cml.molecule[${index}]`;
            if (!isRecord(moleculeValue)) {
                violations.push({ path, message: 'must be an object' });
                continue;
            }
            validateKeys(moleculeValue, ['id', 'title', 'name', 'propertyList'], path, violations);

            const names = asArray(moleculeValue.name);
            if (names.length === 0) {
                violations.push({ path: `${path}.name`, message: 'is required' });
            }
            const regularName = names.find(
                (name) =>
                    typeof name === 'string' || (isRecord(name) && name.convention === undefined)
            );
            const slugName = names.find(
                (name) => isRecord(name) && name.convention === 'yndx:slug'
            );
            for (const [nameIndex, nameValue] of names.entries()) {
                if (isRecord(nameValue)) {
                    validateKeys(
                        nameValue,
                        ['#text', 'convention'],
                        `${path}.name[${nameIndex}]`,
                        violations
                    );
                }
            }
            const id = typeof moleculeValue.id === 'string' ? moleculeValue.id : '';
            const name = textContent(regularName);
            const slug = textContent(slugName);
            if (id.trim() === '') {
                violations.push({ path: `${path}.id`, message: 'must be a non-empty string' });
            }
            if (!name || name.trim() === '') {
                violations.push({ path: `${path}.name`, message: 'must contain a resource name' });
            }
            if (!slug || slug.trim() === '') {
                violations.push({
                    path: `${path}.name[convention=yndx:slug]`,
                    message: 'is required',
                });
            }

            const properties = new Map<string, string>();
            if (!isRecord(moleculeValue.propertyList)) {
                violations.push({ path: `${path}.propertyList`, message: 'is required' });
                continue;
            }
            validateKeys(
                moleculeValue.propertyList,
                ['property'],
                `${path}.propertyList`,
                violations
            );

            const propertyValues = asArray(moleculeValue.propertyList.property);
            if (propertyValues.length === 0) {
                violations.push({ path: `${path}.propertyList.property`, message: 'is required' });
            }
            for (const [propertyIndex, propertyValue] of propertyValues.entries()) {
                const propertyPath = `${path}.propertyList.property[${propertyIndex}]`;
                if (!isRecord(propertyValue)) {
                    violations.push({ path: propertyPath, message: 'must be an object' });
                    continue;
                }
                validateKeys(
                    propertyValue,
                    ['dictRef', 'title', 'scalar'],
                    propertyPath,
                    violations
                );
                if (typeof propertyValue.dictRef !== 'string' || propertyValue.dictRef === '') {
                    violations.push({ path: `${propertyPath}.dictRef`, message: 'is required' });
                    continue;
                }
                const propertyValueText = textContent(propertyValue.scalar);
                if (propertyValueText === undefined) {
                    violations.push({ path: `${propertyPath}.scalar`, message: 'is required' });
                    continue;
                }
                if (isRecord(propertyValue.scalar)) {
                    validateKeys(
                        propertyValue.scalar,
                        ['#text', 'dataType', 'units'],
                        `${propertyPath}.scalar`,
                        violations
                    );
                }
                properties.set(propertyValue.dictRef.replace(/^.*:/u, ''), propertyValueText);
            }

            const kind = properties.get('kind');
            if (!['mineral', 'liquid', 'gas'].includes(String(kind))) {
                violations.push({
                    path: `${path}.propertyList.kind`,
                    message: 'must be mineral, liquid, or gas',
                });
                continue;
            }
            if (!id || !name || !slug) {
                continue;
            }

            if (kind === 'mineral') {
                const mass = finiteNumber(properties.get('mass'));
                const superconductingThreshold = finiteNumber(
                    properties.get('superconductingThreshold')
                );
                if (mass === undefined || mass < 0) {
                    violations.push({
                        path: `${path}.propertyList.mass`,
                        message: 'must be a non-negative number',
                    });
                }
                if (superconductingThreshold === undefined || superconductingThreshold < 0) {
                    violations.push({
                        path: `${path}.propertyList.superconductingThreshold`,
                        message: 'must be a non-negative number',
                    });
                }
                if (
                    mass !== undefined &&
                    mass >= 0 &&
                    superconductingThreshold !== undefined &&
                    superconductingThreshold >= 0
                ) {
                    resources.push({ id, name, slug, kind, mass, superconductingThreshold });
                }
                continue;
            }

            const volume = finiteNumber(properties.get('volume'));
            const volatility = finiteNumber(properties.get('volatility'));
            if (volume === undefined || volume < 0) {
                violations.push({
                    path: `${path}.propertyList.volume`,
                    message: 'must be a non-negative number',
                });
            }
            if (volatility === undefined || volatility < 0) {
                violations.push({
                    path: `${path}.propertyList.volatility`,
                    message: 'must be a non-negative number',
                });
            }
            if (
                volume !== undefined &&
                volume >= 0 &&
                volatility !== undefined &&
                volatility >= 0
            ) {
                if (kind === 'liquid') {
                    resources.push({ id, name, slug, kind: 'liquid', volume, volatility });
                } else if (kind === 'gas') {
                    resources.push({ id, name, slug, kind: 'gas', volume, volatility });
                }
            }
        }

        if (violations.length > 0) {
            throw new ContractViolationError(violations);
        }
        return resources;
    }

    private validateDocumentStructure(xml: string): ContractViolation[] {
        const violations: ContractViolation[] = [];
        const parsed: unknown = this.orderedParser.parse(xml);
        if (!Array.isArray(parsed)) {
            return [{ path: '$.cml', message: 'is required' }];
        }

        const root = parsed.find(
            (item) => isRecord(item) && elementKeys(item).some((key) => localName(key) === 'cml')
        );
        if (!isRecord(root)) {
            return [{ path: '$.cml', message: 'is required' }];
        }

        const rootKey = elementKeys(root).find((key) => localName(key) === 'cml');
        if (!rootKey) {
            return [{ path: '$.cml', message: 'is required' }];
        }

        const rootNamespaces = namespacesFor(root);
        validateElementNamespace(rootKey, rootNamespaces, '$.cml.xmlns', violations);

        const rootChildren = root[rootKey];
        if (!Array.isArray(rootChildren)) {
            violations.push({ path: '$.cml', message: 'must contain only molecule elements' });
            return violations;
        }

        for (const [index, child] of rootChildren.entries()) {
            const path = `$.cml.molecule[${index}]`;
            if (!isRecord(child)) {
                violations.push({ path, message: 'must be an object' });
                continue;
            }
            const childKeys = elementKeys(child);
            if (childKeys.length !== 1 || localName(childKeys[0]) !== 'molecule') {
                violations.push({ path: '$.cml', message: 'may contain only molecule elements' });
                continue;
            }
            const moleculeNamespaces = namespacesFor(child, rootNamespaces);
            validateElementNamespace(childKeys[0], moleculeNamespaces, path, violations);

            const moleculeChildren = child[childKeys[0]];
            if (!Array.isArray(moleculeChildren)) {
                violations.push({ path, message: 'must contain name and propertyList elements' });
                continue;
            }

            let nameCount = 0;
            let propertyListCount = 0;
            for (const moleculeChild of moleculeChildren) {
                if (!isRecord(moleculeChild)) {
                    continue;
                }
                const keys = elementKeys(moleculeChild);
                if (keys.length !== 1) {
                    violations.push({ path, message: 'contains an invalid element' });
                    continue;
                }
                const childName = localName(keys[0]);
                const childNamespaces = namespacesFor(moleculeChild, moleculeNamespaces);
                validateElementNamespace(
                    keys[0],
                    childNamespaces,
                    `${path}.${childName}`,
                    violations
                );
                if (childName === 'name' && propertyListCount === 0) {
                    nameCount += 1;
                } else if (childName === 'propertyList') {
                    propertyListCount += 1;
                    this.validatePropertyListNamespaces(
                        moleculeChild[keys[0]],
                        childNamespaces,
                        `${path}.propertyList`,
                        violations
                    );
                } else {
                    violations.push({
                        path,
                        message: 'must contain names followed by one propertyList',
                    });
                }
            }
            if (nameCount === 0 || propertyListCount !== 1) {
                violations.push({
                    path,
                    message: 'must contain names followed by one propertyList',
                });
            }
        }

        return violations;
    }

    private validatePropertyListNamespaces(
        value: unknown,
        inheritedNamespaces: Map<string, string>,
        path: string,
        violations: ContractViolation[]
    ): void {
        if (!Array.isArray(value)) {
            return;
        }

        for (const [propertyIndex, property] of value.entries()) {
            if (!isRecord(property)) {
                continue;
            }
            const propertyKeys = elementKeys(property);
            if (propertyKeys.length !== 1 || localName(propertyKeys[0]) !== 'property') {
                continue;
            }
            const propertyPath = `${path}.property[${propertyIndex}]`;
            const propertyNamespaces = namespacesFor(property, inheritedNamespaces);
            validateElementNamespace(propertyKeys[0], propertyNamespaces, propertyPath, violations);

            const propertyChildren = property[propertyKeys[0]];
            if (!Array.isArray(propertyChildren)) {
                continue;
            }
            for (const scalar of propertyChildren) {
                if (!isRecord(scalar)) {
                    continue;
                }
                const scalarKeys = elementKeys(scalar);
                if (scalarKeys.length !== 1 || localName(scalarKeys[0]) !== 'scalar') {
                    continue;
                }
                const scalarNamespaces = namespacesFor(scalar, propertyNamespaces);
                validateElementNamespace(
                    scalarKeys[0],
                    scalarNamespaces,
                    `${propertyPath}.scalar`,
                    violations
                );
            }
        }
    }
}

export const xmlService = new XMLService();
