import { CloudFormationData, TemplateData } from '../reducers/reducers';
import {
  CREATE_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_LOADING,
  CREATE_TEMPLATE_ERROR,
  SEND_TEMPLATE_SUCCESS,
  SEND_TEMPLATE_LOADING,
  SEND_TEMPLATE_ERROR,
} from '../constants/constants';

export type Action =
  | CreateTemplateSuccess
  | CreateTemplateLoading
  | CreateTemplateError
  | SendTemplateSuccess
  | SendTemplateLoading
  | SendTemplateError;

// ************************************************************************
// TEMPLATE
// ************************************************************************

export interface CreateTemplateSuccess {
  type: CREATE_TEMPLATE_SUCCESS;
  data: TemplateData;
}

export function createTemplateSuccess(data: TemplateData): CreateTemplateSuccess {
  return {
    type: CREATE_TEMPLATE_SUCCESS,
    data,
  };
}

export interface CreateTemplateLoading {
  type: CREATE_TEMPLATE_LOADING;
}

export function createTemplateLoading(): CreateTemplateLoading {
  return {
    type: CREATE_TEMPLATE_LOADING,
  };
}

export interface CreateTemplateError {
  type: CREATE_TEMPLATE_ERROR;
  data: string | null;
}

export function createTemplateError(data: string | null): CreateTemplateError {
  return {
    type: CREATE_TEMPLATE_ERROR,
    data,
  };
}

// ************************************************************************
// CLOUDFORMATION
// ************************************************************************

export interface SendTemplateSuccess {
  type: SEND_TEMPLATE_SUCCESS;
  data: CloudFormationData;
}

export function sendTemplateSuccess(data: CloudFormationData): SendTemplateSuccess {
  return {
    type: SEND_TEMPLATE_SUCCESS,
    data,
  };
}

export interface SendTemplateLoading {
  type: SEND_TEMPLATE_LOADING;
}

export function sendTemplateLoading(): SendTemplateLoading {
  return {
    type: SEND_TEMPLATE_LOADING,
  };
}

export interface SendTemplateError {
  type: SEND_TEMPLATE_ERROR;
  data: string | null;
}

export function sendTemplateError(data: string | null): SendTemplateError {
  return {
    type: SEND_TEMPLATE_ERROR,
    data,
  };
}
