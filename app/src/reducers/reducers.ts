import { Action } from '../actions/actions';
import {
  CREATE_TEMPLATE_SUCCESS,
  CREATE_TEMPLATE_LOADING,
  CREATE_TEMPLATE_ERROR,
  SEND_TEMPLATE_SUCCESS,
  SEND_TEMPLATE_LOADING,
  SEND_TEMPLATE_ERROR,
} from '../constants/constants';

interface FetchState {
  loading: boolean;
  error: string | null;
}

const initialFetchState: FetchState = {
  loading: false,
  error: null,
};

// ************************************************************************
// TEMPLATE
// ************************************************************************

export type TemplateData = string;

interface TemplateState {
  data: TemplateData | null;
  post: FetchState;
}

export const initialTemplateState: TemplateState = {
  data: null,
  post: initialFetchState,
};

export const templateReducer = (state: TemplateState, action: Action): TemplateState => {
  switch (action.type) {
    case CREATE_TEMPLATE_SUCCESS:
      return { ...state, data: action.data, post: { loading: false, error: null } };
    case CREATE_TEMPLATE_LOADING:
      return { ...state, post: { ...state.post, loading: true } };
    case CREATE_TEMPLATE_ERROR:
      return { ...state, post: { loading: false, error: action.data } };
    case SEND_TEMPLATE_SUCCESS:
      return { ...state, data: null };
    default:
      return state;
  }
};

// ************************************************************************
// CLOUDFORMATION
// ************************************************************************

export type CloudFormationData = string;

interface CloudFormationState {
  data: CloudFormationData | null;
  post: FetchState;
}

export const initialCloudFormationState: CloudFormationState = {
  data: null,
  post: initialFetchState,
};

export const cloudFormationReducer = (state: CloudFormationState, action: Action): CloudFormationState => {
  switch (action.type) {
    case SEND_TEMPLATE_SUCCESS:
      return { ...state, data: action.data, post: { loading: false, error: null } };
    case SEND_TEMPLATE_LOADING:
      return { ...state, post: { ...state.post, loading: true } };
    case SEND_TEMPLATE_ERROR:
      return { ...state, post: { loading: false, error: action.data } };
    default:
      return state;
  }
};
