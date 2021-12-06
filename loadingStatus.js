      var statusBar = document.getElementById("statusBar");
      statusBar.style.backgroundColor = '#00ff00';
      statusBar.style.height = '20px';
      statusBar.style.maxWidth = '40px';
      statusBar.style.minWidth = '0px';
      var progress = function() {
        var dReadyState = document.readyState;
        if (dReadyState == 'uninitialized') {
          return '0%';
        } else if (dReadyState == 'loading') {
          return '20%';
        } else if (dReadyState == 'loaded') {
          return '40%';
        } else if (dReadyState == 'interactive') {
          return '60%';
        } else if (dReadyState == 'complete') {
          return '100%';
        }
      };
      statusBar.style.width = progress;
