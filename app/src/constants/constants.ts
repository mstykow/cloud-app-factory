// ************************************************************************
// CLOUDFORMATION
// ************************************************************************

import { Color } from '@material-ui/lab';

export const CREATE_TEMPLATE_SUCCESS = 'CREATE_TEMPLATE_SUCCESS';
export type CREATE_TEMPLATE_SUCCESS = typeof CREATE_TEMPLATE_SUCCESS;

export const CREATE_TEMPLATE_LOADING = 'CREATE_TEMPLATE_LOADING';
export type CREATE_TEMPLATE_LOADING = typeof CREATE_TEMPLATE_LOADING;

export const CREATE_TEMPLATE_ERROR = 'CREATE_TEMPLATE_ERROR';
export type CREATE_TEMPLATE_ERROR = typeof CREATE_TEMPLATE_ERROR;

// ************************************************************************
// TEMPLATE
// ************************************************************************

export const SEND_TEMPLATE_SUCCESS = 'SEND_TEMPLATE_SUCCESS';
export type SEND_TEMPLATE_SUCCESS = typeof SEND_TEMPLATE_SUCCESS;

export const SEND_TEMPLATE_LOADING = 'SEND_TEMPLATE_LOADING';
export type SEND_TEMPLATE_LOADING = typeof SEND_TEMPLATE_LOADING;

export const SEND_TEMPLATE_ERROR = 'SEND_TEMPLATE_ERROR';
export type SEND_TEMPLATE_ERROR = typeof SEND_TEMPLATE_ERROR;

// ************************************************************************
// TEMPLATE
// ************************************************************************

export interface SnackbarData {
  message: string;
  severity: Color;
}
