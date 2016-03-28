import superagent from 'superagent';

export function executeJob() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      superagent
        .get('http://192.168.99.100/job')
        .end(function(error, response) {
          return error ? reject(error) : resolve();
        });
    });
  }
}
