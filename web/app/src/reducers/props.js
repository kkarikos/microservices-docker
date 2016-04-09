import * as actions from 'actions';
import { Map } from 'immutable';

export const initialState = {
  isBusy: false,
  endorsement: Map(),
  users: [
    '@aino.kuokka',
    '@anni',
    '@arto.jalkanen',
    '@emma',
    '@esa',
    '@harri.mahonen',
    '@henrik.kouri',
    '@ilkka.rautiainen',
    '@jan.nikander',
    '@janette.lehtola',
    '@jani.arvonen',
    '@janne.villikka',
    '@jari-pekka.ryynanen',
    '@jarkko.rantavuori',
    '@joonas.toivanen',
    '@kalle',
    '@karhuton',
    '@kimmo.surakka',
    '@lasse.leino',
    '@lauri.tikkanen',
    '@marjaana.huitila'
  ],
  fruits: [
    'Apple', 'Apricot', 'Avocado',
    'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
    'Boysenberry', 'Blood Orange',
    'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry',
    'Coconut', 'Cranberry', 'Clementine',
    'Damson', 'Date', 'Dragonfruit', 'Durian',
    'Elderberry',
    'Feijoa', 'Fig',
    'Goji berry', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
    'Honeydew', 'Huckleberry',
    'Jabouticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry',
    'Kiwi fruit', 'Kumquat',
    'Lemon', 'Lime', 'Loquat', 'Lychee',
    'Nectarine',
    'Mango', 'Marion berry', 'Melon', 'Miracle fruit', 'Mulberry', 'Mandarine',
    'Olive', 'Orange',
    'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plum', 'Pineapple',
    'Pumpkin', 'Pomegranate', 'Pomelo', 'Purple Mangosteen',
    'Quince',
    'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant',
    'Salal berry', 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry',
    'Tamarillo', 'Tamarind', 'Tomato', 'Tangerine',
    'Ugli fruit',
    'Watermelon'
  ]
};

export function props(state = initialState, action) {
  switch (action.type) {
    case actions.CHANGE_FIELD_VALUE:
      return {
        ...state,
        endorsement: state.endorsement.set(action.field, action.value)
      };
    case actions.ENDORSEMENT_ADD_REQUEST:
      return {
        ...state,
        isBusy: true
      }
    case actions.ENDORSEMENT_ADD_SUCCESS:
      return {
        ...state,
        isBusy: true
      }
    default:
      return state;
  }
}
