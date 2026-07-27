import { DefinitionList } from '@gravity-ui/uikit';

import type { AsteroidResource } from '../../asteroid/model/types';
import { getResourceKindLabel } from '../model/aggregateResources';

type ResourceDetailsProps = {
    resource: AsteroidResource;
};

const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });

export function ResourceDetails({ resource }: ResourceDetailsProps) {
    switch (resource.kind) {
        case 'mineral':
            return (
                <DefinitionList responsive>
                    <DefinitionList.Item name="Тип">
                        {getResourceKindLabel(resource.kind)}
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Масса">
                        {numberFormatter.format(resource.mass)} т
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Порог сверхпроводимости">
                        {numberFormatter.format(resource.superconductingThreshold)} К
                    </DefinitionList.Item>
                </DefinitionList>
            );
        case 'liquid':
            return (
                <DefinitionList responsive>
                    <DefinitionList.Item name="Тип">
                        {getResourceKindLabel(resource.kind)}
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Объём">
                        {numberFormatter.format(resource.volume)} л
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Давление испарения">
                        {numberFormatter.format(resource.volatility)} Па
                    </DefinitionList.Item>
                </DefinitionList>
            );
        case 'gas':
            return (
                <DefinitionList responsive>
                    <DefinitionList.Item name="Тип">
                        {getResourceKindLabel(resource.kind)}
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Объём">
                        {numberFormatter.format(resource.volume)} м³
                    </DefinitionList.Item>
                    <DefinitionList.Item name="Давление разложения">
                        {numberFormatter.format(resource.volatility)} Па
                    </DefinitionList.Item>
                </DefinitionList>
            );
    }
}
