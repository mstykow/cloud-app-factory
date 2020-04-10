import { Button, CircularProgress, Grid, Snackbar, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';
import React, { useEffect, useReducer, useState } from 'react';
import {
  createTemplateError,
  createTemplateLoading,
  createTemplateSuccess,
  sendTemplateError,
  sendTemplateLoading,
  sendTemplateSuccess,
} from './actions/actions';
import useStyles from './App.style';
import AwsService from './AwsService/AwsService';
import config from './config';
import { SnackbarData } from './constants/constants';
import {
  cloudFormationReducer,
  initialCloudFormationState,
  initialTemplateState,
  templateReducer,
} from './reducers/reducers';

const App: React.FC = () => {
  const classes = useStyles();
  const [templateState, templateDispatch] = useReducer(templateReducer, initialTemplateState);
  const [cloudFormationState, cloudFormationDispatch] = useReducer(cloudFormationReducer, initialCloudFormationState);
  const [maximum, setMaximum] = useState<number>(10000);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarData, setSnackbarProps] = useState<SnackbarData | null>(null);

  useEffect(() => {
    (async () => {
      const { accessKeyId, secretAccessKey, sessionToken } = await Auth.currentCredentials();
      AwsService.init({ accessKeyId, secretAccessKey, sessionToken }, config.REGION);
    })();
    return () => {
      AwsService.unsetCredentials();
    };
  }, []);

  useEffect(() => {
    if (templateState.post.error) {
      setSnackbarProps({ message: templateState.post.error, severity: 'error' });
      setSnackbarOpen(true);
    }
    if (cloudFormationState.post.error) {
      setSnackbarProps({ message: cloudFormationState.post.error, severity: 'error' });
      setSnackbarOpen(true);
    }
    if (cloudFormationState.data) {
      setSnackbarProps({ message: `Creating ${cloudFormationState.data}`, severity: 'success' });
      setSnackbarOpen(true);
    }
  }, [templateState.post.error, cloudFormationState.post.error, cloudFormationState.data]);

  const handleSnackbarClose = (_event: React.SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') {
      setSnackbarOpen(false);
      setSnackbarProps(null);
    }
  };

  const onRequestTemplate = async () => {
    try {
      templateDispatch(createTemplateLoading());
      const templateResponse = await fetch(config.TEMPLATE_FACTORY_INVOKE_URL, {
        body: JSON.stringify({ maximum }),
        method: 'POST',
      });
      const responseBody: string = await templateResponse.text();
      templateDispatch(createTemplateSuccess(responseBody));
    } catch (error) {
      templateDispatch(createTemplateError(error.toString()));
    }
  };

  const onSendTemplate = async () => {
    if (templateState.data) {
      try {
        cloudFormationDispatch(sendTemplateLoading());
        const stackId = await AwsService.createStackFromTemplate(`randomNumberStack-${maximum}`, templateState.data);
        if (stackId) {
          cloudFormationDispatch(sendTemplateSuccess(stackId));
          templateDispatch(sendTemplateSuccess(stackId));
        } else {
          cloudFormationDispatch(sendTemplateError('No Stack ID received'));
        }
      } catch (error) {
        cloudFormationDispatch(sendTemplateError(error.toString()));
      }
    }
  };

  return (
    <>
      <Grid container spacing={1} alignContent='center' justify='center' className={classes.container}>
        <Grid item xs={12} className={classes.textAlignCenter}>
          <TextField
            type='number'
            value={maximum}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setMaximum(event.target.valueAsNumber)}
            inputProps={{ min: 1, step: '1' }}
            variant='outlined'
            label='Highest Random Number'
          />
        </Grid>
        <Grid item xs={12} className={classes.textAlignCenter}>
          <Button
            variant='contained'
            color='primary'
            onClick={onRequestTemplate}
            disabled={templateState.post.loading}
            className={classes.button}
          >
            {templateState.post.loading ? <CircularProgress size={20} /> : 'Request Template'}
          </Button>
        </Grid>
        <Grid item xs={12} className={classes.textAlignCenter}>
          <Button
            variant='contained'
            color='primary'
            onClick={onSendTemplate}
            disabled={!templateState.data || cloudFormationState.post.loading}
            className={classes.button}
          >
            {cloudFormationState.post.loading ? <CircularProgress size={20} /> : 'Build Stack'}
          </Button>
        </Grid>
      </Grid>
      {renderSnackbar()}
    </>
  );

  function renderSnackbar() {
    return (
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert elevation={6} variant='filled' severity={snackbarData?.severity} onClose={handleSnackbarClose}>
          {snackbarData?.message}
        </Alert>
      </Snackbar>
    );
  }
};

export default withAuthenticator(App);
