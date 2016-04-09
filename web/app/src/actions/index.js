import superagent from 'superagent';

export const SELECT_SLUG = 'SELECT_SLUG';
export const CHANGE_FIELD_VALUE = 'CHANGE_FIELD_VALUE';
export const ENDORSEMENT_ADD_REQUEST = 'ENDORSEMENT_ADD_REQUEST';
export const ENDORSEMENT_ADD_SUCCESS = 'ENDORSEMENT_ADD_SUCCESS';

export function updateValue(field, value) {
  return {
    type: CHANGE_FIELD_VALUE,
    field: field,
    value: value
  };
}

export function selectSlug(slug) {
  return {
    type: SELECT_SLUG,
    slug: slug
  };
}

export function saveEndorsement() {
  return (dispatch, getState) => {
    const { props } = getState();
    return new Promise((resolve, reject) => {
      // TODO: xhr
      const endorsement = props.endorsement.toJS();
      debugger;
      dispatch({type: ENDORSEMENT_ADD_SUCCESS});
      resolve();
      /*
      superagent
        .get('http://192.168.99.100/job')
        .end(function(error, response) {
          return error ? reject(error) : resolve();
        });
      */
    });

  }
}

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
