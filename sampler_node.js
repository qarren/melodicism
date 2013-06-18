(function () {
  var root = this;
  var me = root.Melodicism.SamplerNode = root.Melodicism.Node.extend();

  var Audio;

  me.init = function (options) {
    root.Melodicism.Node.init.call(this, options);
    this.soup = root.Melodicism.Node;

    Audio = this.Audio;

    if (typeof options.src === 'string') {
      this.srces = [options.src];
    } else {
      this.srces = options.src;
    }
    this.onload = options.onload || function () {};
    this.loaded = false;

    this.period = 4;

    this.load();

    return this;
  };

  me.load = function () {
    var self = this;
    var count = self.srces.length;

    self.buffers = _.toKeys(self.srces);

    _.each(self.srces, function (src) {
      var request = new XMLHttpRequest();
      request.open('GET', src, true);
      request.responseType = 'arraybuffer';

      // Decode asynchronously
      request.onload = function () {
        Audio.ctx.decodeAudioData(request.response, function (buffer) {
          self.buffers[src] = buffer;
          count--;
          console.log("Loaded " + src);

          if (count < 1) {
            self.onload();
            self.loaded = true;
            self.bufferArray = _.toArray(self.buffers);
            self.buffer = self.bufferArray[0];
          }
        }, function () {

        });
      }

      request.send();
    });
  };

  me.pulse = function (ct) {
    this.currentTime = ct;

    if (!this.loaded) {
      return false;
    }

    this.gainer.gain.setValueAtTime(1, ct);

    this.sampler = Audio.ctx.createBufferSource();
    this.sampler.buffer = this.buffer;
    this.sampler.connect(this.gainer);
    this.sampler.start(ct);
  };

  me.tick = function (currentTime) {
    if (this.active && Math.abs(currentTime - this.currentTime) < 0.01) {
      this.pulseLocation = this.location;
      this.buffer = this.bufferArray[Math.floor(this.bufferArray.length * this.location.y / 700)];
    }

    if (this.active && currentTime >= this.currentTime) {
      this.nextTime = this.currentTime + this.period;
      this.pulse(this.nextTime);
    }
  };

}());
