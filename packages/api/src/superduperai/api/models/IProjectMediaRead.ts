// @ts-nocheck
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IDataRead } from './IDataRead';
import type { IMusicRead } from './IMusicRead';
import type { IStyleRead } from './IStyleRead';
import type { ITaskRead } from './ITaskRead';
import type { ProjectTypeEnum } from './ProjectTypeEnum';
export type IProjectMediaRead = {
    config?: Record<string, any>;
    thumbnail_url?: (string | null);
    id: string;
    type: ProjectTypeEnum;
    data: Array<IDataRead>;
    tasks: Array<ITaskRead>;
    music: (IMusicRead | null);
    template_name: (string | null);
    style_name: (string | null);
    music_id: (string | null);
    style: (IStyleRead | null);
    created_at: string;
    rating?: (number | null);
    comment?: (string | null);
    public?: boolean;
};

