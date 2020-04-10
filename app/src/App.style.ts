/* eslint no-useless-computed-key: 0 */

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

export default makeStyles((_theme: Theme) =>
  createStyles({
    container: {
      height: '100vh',
      width: 'initial',
      margin: 'initial',
    },

    textAlignCenter: {
      textAlign: 'center',
    },

    button: {
      width: 229,
      height: 36,
    },
  })
);
