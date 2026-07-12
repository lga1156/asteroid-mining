import { CircleFill } from '@gravity-ui/icons';
import { Icon } from '@gravity-ui/uikit';

import type { Resource } from '../types/domain';

interface ResourceIconProps {
    resource: Resource;
}

const LIQUID_RESOURCE_COLOR = '#efb118';
const MINERAL_RESOURCE_COLOR = '#4269D0';
const GAS_RESOURCE_COLOR = '#6cc5d3';

const RESOURCE_COLORS: Record<Resource['kind'], string> = {
    mineral: MINERAL_RESOURCE_COLOR,
    liquid: LIQUID_RESOURCE_COLOR,
    gas: GAS_RESOURCE_COLOR,
};

export function ResourceIcon({ resource }: ResourceIconProps) {
    const color = RESOURCE_COLORS[resource.kind];

    return <Icon data={CircleFill} size={12} style={{ color }} />;
}
