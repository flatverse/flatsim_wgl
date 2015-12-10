var test_controls = {
  x: 100,
  y: 20,
  x_comp: 'left',
  y_comp: 'top',
  button_timeout: 5000,

  // flags
  button_flags: {
    up: null,
    down: null,
    left: null,
    right: null,
    forward: null,
    backward: null,
    clockwise: null,
    counter: null,
  },
  buttons: {},

  init: function () {
    this.buttons.up = this.make_button('images/arrow_up.png', 0, 0, 'up');
    document.body.appendChild(this.buttons.up);
    this.buttons.down = this.make_button('images/arrow_down.png', 0, 96, 'down');
    document.body.appendChild(this.buttons.down);

    this.buttons.left = this.make_button('images/arrow_left.png', -24, 48, 'left');
    document.body.appendChild(this.buttons.left);
    this.buttons.right = this.make_button('images/arrow_right.png', 24, 48, 'right');
    document.body.appendChild(this.buttons.right);

    this.buttons.clockwise = this.make_button('images/arrow_rotate_clock.png', -48, 0, 'clockwise');
    document.body.appendChild(this.buttons.clockwise);
    this.buttons.counter = this.make_button('images/arrow_rotate_counter.png', 48, 0, 'counter');
    document.body.appendChild(this.buttons.counter);

    this.buttons.forward = this.make_button('images/arrow_forward.png', -48, 96, 'forward');
    document.body.appendChild(this.buttons.forward);
    this.buttons.backward = this.make_button('images/arrow_backward.png', 48, 96, 'backward');
    document.body.appendChild(this.buttons.backward);
  },

  button_is_pressed: function (buttonName) {
    return this.button_flags[buttonName] && Date.now() - this.button_flags[buttonName] <= this.button_timeout;
  },

  select_button: function (buttonName) {
    this.button_flags[buttonName] = Date.now();
    this.buttons[buttonName].style.backgroundColor = '#22aaff';
  },
  deselect_button: function (buttonName) {
    this.button_flags[buttonName] = null;
    this.buttons[buttonName].style.backgroundColor = '';
  },

  make_button: function (imgPath, offsetX, offsetY, buttonName) {
    var button = document.createElement('img');
    button.src = imgPath;
    button.style.position = 'fixed';
    button.style[this.x_comp] = (this.x + offsetX) + 'px';
    button.style[this.y_comp] = (this.y + offsetY) + 'px';

    var self = this;
    button.addEventListener('mousedown', function () {
      self.select_button(buttonName);
    });
    button.addEventListener('mouseup', function () {
      self.deselect_button(buttonName);
    });
    button.addEventListener('mouseleave', function () {
      self.deselect_button(buttonName);
    });

    return button;
  },
};