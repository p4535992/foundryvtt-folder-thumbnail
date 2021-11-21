import { warn, error, debug, i18n } from '../foundryvtt-folder-thumbnail';

export const readyHooks = async () => {
  Hooks.on('renderActorDirectory', async function (args) {
    //
  });

  Hooks.on('renderItemDirectory', async function (args) {
    //
  });

  Hooks.on('renderJournalDirectory', async function (args) {
    //
  });

  Hooks.on('renderPlaylistDirectory', async function (args) {
    //
  });

  Hooks.on('renderRollTableDirectory', async function (args) {
    //
  });

  Hooks.on('renderSceneDirectory', async function (args) {
    //
  });

  Hooks.on('renderMacroDirectory', async function (args) {
    //
  });
};

export const setupHooks = async () => {
  // setup all the hooks
};

export const initHooks = () => {
  warn('Init Hooks processing');
};
