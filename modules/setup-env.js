const webpack = require('webpack');

export default function() {
  this.extendBuild(config => {
    const defaults = {
      // SteemConnect settings
      SC_BROADCAST_ACCOUNT: 'steemdunk',
      SC_HOST: 'https://v2.steemconnect.com',
      SC_REDIRECT_URI: 'https://steemdunk.xyz/callback'
    };

    if (process.env.NODE_ENV !== 'production') {
      defaults.SC_HOST = 'http://localhost:3500';
      defaults.SC_REDIRECT_URI = 'http://localhost:3000/callback';
    }

    config.plugins.push(new webpack.EnvironmentPlugin(defaults));
  });
}
