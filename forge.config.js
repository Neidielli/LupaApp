module.exports = {
  packagerConfig: {
    asar: false,    
    ignore: (file) => {
      if (file === 'seu-banco-de-dados.db') {
        return true;
      }
      return false;}},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
      }
    }
  ],
};
