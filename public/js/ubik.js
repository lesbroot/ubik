// Generated by CoffeeScript 1.9.3
(function() {
  var Animation, BoxAnimation, CircleVideoAnimation, PlaneVideoAnimation, VideoAnimation, addAnim, addVideoAnim, createStats, framesize, getBackgroundCircle, getCircleMesh, getPlaneMesh, initAnims, removeAnim, removeVideoAnim, setAnim, setupCamera, setupLight, setupRenderer, setupSocket, startLoop, videos,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  framesize = 20;

  videos = {
    bg: {
      0: 'bg_0.mp4',
      1: 'bg_1.mp4',
      2: 'bg_2.mp4',
      3: 'bg_3.mp4',
      4: 'bg_4.mp4'
    },
    fg: {
      0: 'fg_0.mp4',
      1: 'fg_1.mp4',
      2: 'fg_2.mp4',
      3: 'fg_3.mp4',
      4: 'fg_4.mp4'
    }
  };

  Animation = (function() {
    function Animation(id) {
      this.id = id;
    }

    Animation.prototype.update = function(delta, now, audioData) {};

    Animation.prototype.start = function() {};

    Animation.prototype.stop = function() {};

    return Animation;

  })();

  VideoAnimation = (function(superClass) {
    extend(VideoAnimation, superClass);

    function VideoAnimation(id) {
      this.id = id;
    }

    VideoAnimation.prototype.getVideoTexture = function(url) {
      var videoTexture;
      videoTexture = new THREEx.VideoTexture(url);
      videoTexture.minFilter = THREE.LinearFilter;
      return videoTexture;
    };

    VideoAnimation.prototype.getMaterial = function(videoTexture) {
      return new THREE.MeshBasicMaterial({
        map: videoTexture.texture
      });
    };

    VideoAnimation.prototype.update = function(delta, now, audioData) {
      return this.videoTexture.update(delta, now);
    };

    VideoAnimation.prototype.start = function() {
      var video;
      video = this.videoTexture.video;
      return video.play();
    };

    VideoAnimation.prototype.stop = function() {
      return this.videoTexture.video.pause();
    };

    return VideoAnimation;

  })(Animation);

  CircleVideoAnimation = (function(superClass) {
    extend(CircleVideoAnimation, superClass);

    function CircleVideoAnimation(id) {
      var material;
      this.id = id;
      this.url = videos.fg[this.id];
      this.videoTexture = this.getVideoTexture(this.url);
      material = this.getMaterial(this.videoTexture);
      this.mesh = getCircleMesh(material, 0.2);
      this.mesh.position.set(0, 0, 0.1);
    }

    return CircleVideoAnimation;

  })(VideoAnimation);

  BoxAnimation = (function(superClass) {
    extend(BoxAnimation, superClass);

    function BoxAnimation(id) {
      var material, texture;
      this.id = id;
      texture = this.getTexture();
      material = this.getMaterial(texture);
      this.mesh = this.getBoxMesh(material);
      this.mesh.position.set(0, 0, 0.1);
    }

    BoxAnimation.prototype.getTexture = function() {
      return THREE.ImageUtils.loadTexture("/images/marble.jpg");
    };

    BoxAnimation.prototype.getMaterial = function(texture) {
      return new THREE.MeshLambertMaterial({
        map: texture
      });
    };

    BoxAnimation.prototype.getBoxMesh = function(material) {
      var rings, side;
      side = 0.15;
      rings = 16;
      return new THREE.Mesh(new THREE.BoxGeometry(side, side, side), material);
    };

    BoxAnimation.prototype.update = function(delta, now, audioData) {
      if (audioData[0] > 200) {
        this.mesh.rotation.x += 0.1;
      }
      if (audioData[1] > 200) {
        return this.mesh.rotation.y += 0.1;
      }
    };

    return BoxAnimation;

  })(Animation);

  PlaneVideoAnimation = (function(superClass) {
    extend(PlaneVideoAnimation, superClass);

    function PlaneVideoAnimation(id) {
      var material;
      this.id = id;
      this.url = videos.bg[this.id];
      this.videoTexture = this.getVideoTexture(this.url);
      material = this.getMaterial(this.videoTexture);
      this.mesh = getPlaneMesh(material);
    }

    return PlaneVideoAnimation;

  })(VideoAnimation);

  setupRenderer = function() {
    var renderer;
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setClearColor(new THREE.Color('lightgrey'), 1);
    renderer.setSize(1920 - (framesize * 2), 1080 - (framesize * 2));
    return renderer;
  };

  setupCamera = function(scene) {
    var camera;
    camera = new THREE.PerspectiveCamera(45, (1920 - (framesize * 2)) / (1080 - (framesize * 2)), 0.1, 10000);
    camera.position.set(0, 0, 1);
    camera.lookAt(scene.position);
    return camera;
  };

  setupLight = function() {
    var light;
    light = new THREE.PointLight(0xFFFFFF);
    light.position.set(10, 0, 10);
    return light;
  };

  getCircleMesh = function(material, radius) {
    var circleGeometry, segments;
    segments = 128;
    circleGeometry = new THREE.CircleGeometry(radius, segments);
    return new THREE.Mesh(circleGeometry, material);
  };

  getPlaneMesh = function(material) {
    var planeGeometry;
    planeGeometry = new THREE.PlaneGeometry(1.5, 0.83);
    return new THREE.Mesh(planeGeometry, material);
  };

  startLoop = function(render_fn, current_animations, audioData) {
    var animate, lastTimeMsec;
    lastTimeMsec = null;
    animate = function(nowMsec) {
      var deltaMsec;
      setTimeout((function() {
        return requestAnimationFrame(animate);
      }), 1000 / 30);
      lastTimeMsec = lastTimeMsec || nowMsec - (1000 / 60);
      deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
      lastTimeMsec = nowMsec;
      _.forEach(current_animations, function(anim, key) {
        return anim.update(deltaMsec / 1000, nowMsec / 1000, audioData);
      });
      return render_fn();
    };
    return requestAnimationFrame(animate);
  };

  removeVideoAnim = function(animations, anim_id, scene) {
    var anim;
    anim = animations[anim_id];
    anim.stop();
    return scene.remove(anim.mesh);
  };

  addVideoAnim = function(anim_type, url, scene, current_animations) {
    current_animations[anim_type];
    return scene.add(mesh);
  };

  createStats = function() {
    var stats;
    stats = new Stats;
    document.body.appendChild(stats.domElement);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.bottom = '0px';
    return stats;
  };

  addAnim = function(anim_type, anim_id, scene, anims, current_anims) {
    var anim;
    anim = anims[anim_type][anim_id];
    anim.start();
    current_anims[anim_type] = anim;
    return scene.add(anim.mesh);
  };

  removeAnim = function(anim_type, current_anims, scene) {
    var old_anim;
    old_anim = current_anims[anim_type];
    old_anim.stop();
    return scene.remove(old_anim.mesh);
  };

  setAnim = function(anim_type, anim_id, scene, anims, current_anims) {
    if (anim_type === 'color') {
      return $('body').css({
        'background-color': '#' + anim_id
      });
    } else {
      removeAnim(anim_type, current_anims, scene);
      return addAnim(anim_type, anim_id, scene, anims, current_anims);
    }
  };

  setupSocket = function(scene, anims, current_anims) {
    var socket;
    socket = io('http://ubikeklektik.herokuapp.com/');
    socket.on('connect', function() {
      return console.log('connected');
    });
    return socket.on('anim response', function(msg) {
      console.log(msg);
      return setAnim(msg.anim_type, msg.anim_id, scene, anims, current_anims);
    });
  };

  initAnims = function(scene) {
    var anims, fg_anims;
    fg_anims = _.map(videos.fg, function(v, k) {
      return new CircleVideoAnimation(k);
    });
    anims = {
      bg: _.map(videos.bg, function(v, k) {
        return new PlaneVideoAnimation(k);
      }),
      fg: fg_anims.concat([new BoxAnimation(6)])
    };
    anims.bg[0].start();
    anims.fg[0].start();
    scene.add(anims.bg[0].mesh);
    scene.add(anims.fg[0].mesh);
    return anims;
  };

  getBackgroundCircle = function() {
    var material, mesh;
    material = new THREE.MeshLambertMaterial({
      color: 0x000000
    });
    mesh = getCircleMesh(material, 0.223);
    mesh.position.set(0, 0, 0.001);
    return mesh;
  };

  window.onload = function() {
    var analyser, anims, audioData, background_circle, camera, current_anims, light, render_fn, renderer, scene, stats;
    analyser = getAudioAnalyser();
    audioData = getDataArray(analyser);
    renderer = setupRenderer();
    document.body.appendChild(renderer.domElement);
    scene = new THREE.Scene;
    camera = setupCamera(scene);
    stats = createStats();
    anims = initAnims(scene);
    current_anims = {
      bg: anims.bg[0],
      fg: anims.fg[0]
    };
    background_circle = getBackgroundCircle();
    scene.add(background_circle);
    light = setupLight();
    scene.add(light);
    setupSocket(scene, anims, current_anims);
    console.log(analyser);
    render_fn = function() {
      renderer.render(scene, camera);
      stats.update();
      return analyser.getByteFrequencyData(audioData);
    };
    return startLoop(render_fn, current_anims, audioData);
  };

}).call(this);
