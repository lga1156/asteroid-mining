import { CircleFill } from '@gravity-ui/icons';
import { Icon } from '@gravity-ui/uikit';

import type { Resource } from '../types/asteroid';

interface ResourceIconProps {
    resource: Resource;
}

const LIQUID_RESOURCE_COLOR = '#efb118';
const MINERAL_RESOURCE_COLOR = '#4269D0';

export function ResourceIcon({ resource }: ResourceIconProps) {
    const color = 'volatility' in resource ? LIQUID_RESOURCE_COLOR : MINERAL_RESOURCE_COLOR;

    return <Icon data={CircleFill} size={12} style={{ color }} />;
}
