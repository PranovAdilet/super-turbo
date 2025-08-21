// @ts-nocheck
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IFileRead } from './IFileRead';
import type { SceneTextbox_Output } from './SceneTextbox_Output';
export type ISceneRead = {
    order: number;
    visual_description?: string;
    action_description?: string;
    dialogue?: Record<string, any>;
    transitions?: Record<string, any>;
    objects?: Array<SceneTextbox_Output>;
    timeline?: Record<string, any>;
    duration?: number;
    id: string;
    file_id: (string | null);
    file: (IFileRead | null);
    voiceover_id: (string | null);
    voiceover: (IFileRead | null);
    sound_effect_id: (string | null);
    sound_effect: (IFileRead | null);
};

