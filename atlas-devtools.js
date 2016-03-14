console.log("Initialising Backbone Atlas");

var scripts = [], resolvedScripts = 0, panelBody = {}, runOnce = false;

// Create dev tools panel

chrome.devtools.panels.create("BackboneAtlas",
  "logo.png",
  "atlas-panel.html",
  function(panel) {
    console.log("Registered Backbone Atlas developer tools panel");
    panel.onShown.addListener(function(panelWindow) {
        if (runOnce) return;
        runOnce = true;
        panelBody = panelWindow.document.body;
        getScripts();
    });
});

// Get resources

function getScripts() {
  chrome.devtools.inspectedWindow.getResources(function(resources) {
      var frames = [];

      for (var i = 0,l = resources.length; i < l; i++) {
          var resource = resources[i];
          switch (resource.type) {
              case 'document':
              {
                frames.push({url: resource.url});
                break;
              }
              case 'script':
              {
                var resourceUrlParts = resource.url.split('/');

                if (resourceUrlParts.indexOf('app') > -1) {

                  scripts.push({
                    file: resourceUrlParts[resourceUrlParts.length - 1],
                    resource: resource
                  });
                }
                break;
              }
          }
      }
      resolveScripts(scripts);
  });

  function resolveScripts(scripts) {
    scripts.forEach(function(script) {
      script.resource.getContent(function(content){
        script.content = content;
        $(panelBody).append('' +
          '<li>' + script.file + '</li>'
        );
      }.bind(this));
    });
  }
}
