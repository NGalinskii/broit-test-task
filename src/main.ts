import initApplication from './app/scripts/init-application';

import '@/app/styles/core.scss';

initApplication().then(() => {
  console.log('Application initialized');
});
