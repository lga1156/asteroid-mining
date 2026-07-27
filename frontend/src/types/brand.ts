declare const brandKey: unique symbol;

type Primitive = string | number;
export type Unbranded<Value extends Primitive> = Value & {
    readonly [brandKey]?: never;
};

export type Branded<Value extends Primitive, Brand extends string> = Value & {
    readonly [brandKey]: Brand;
};

/**
 * Adds a compile-time brand without validating the value. Domain constructors
 * must validate their invariants before calling this function.
 */
export function unsafeBrand<const Value extends Primitive, Brand extends string>(
    value: Unbranded<Value>,
    _brand: Brand
): Branded<Value, Brand> {
    return value as unknown as Branded<Value, Brand>;
}
