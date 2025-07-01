import { Pedido } from "./Pedido";

export type LinkPaginacao = {
    url: string | null;
    label: string;
    active: boolean;
};

export type RequestPedidos = {
    current_page: number;
    data: Pedido[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinkPaginacao[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};
