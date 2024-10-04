export interface Tarifa {
    tipo_producto_id: string;
    id_sociedad: string;
    precio_base: string;
    extra_1: string;
    extra_2: string;
    extra_3: string;
    precio_total: string;
    created_at?: string;
    updated_at?: string;
}

export interface TarifaAnexo {
    id_tipo_anexo: string;
    id_sociedad: string;
    precio_base: string;
    extra_1: string;
    extra_2: string;
    extra_3: string;
    precio_total: string;
    created_at?: string;
    updated_at?: string;
}
