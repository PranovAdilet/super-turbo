// @ts-nocheck
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { INextCursor } from './INextCursor';
import type { ISceneMinimalRead } from './ISceneMinimalRead';
import type { ISceneRead } from './ISceneRead';
export type IResponsePaginated_Union_ISceneRead__ISceneMinimalRead__ = {
    items: Array<(ISceneRead | ISceneMinimalRead)>;
    total: (number | null);
    limit: (number | null);
    offset: (number | null);
    next?: (INextCursor | null);
};

