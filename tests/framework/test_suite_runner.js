test_suite_runner = {
  el_id: 'gltile_tests',

  init: function () {
    test_suite.init();

    this.el = document.getElementById(this.el_id);
    var class_prefix = '';
    if (this.el.className) {
      class_prefix += ' ';
    }
    this.el.className += class_prefix + 'gltile_tests';

    this.create_title();
  },

  create_title: function () {
    var title_el = document.createElement('div');
    title_el.className = 'suite_title';
    title_el.innerHTML = test_suite.title;
    this.el.appendChild(title_el);
  },

  create_cat: function (name, level) {
    var el = document.createElement('div');
    el.className = 'suite_cat cat_level_' + level;
    el.innerHTML = name;
    this.el.appendChild(el);
  },

  create_result: function (test_name, passed, level, message) {
    var el = document.createElement('div');
    el.className = 'suite_test cat_level_' + level + ' ' + (passed && 'test_passed' || 'test_failed');
    var name_el = document.createElement('div');
    name_el.className = 'test_name';
    name_el.innerHTML = test_name + '<span class="test_status_sep"> - </span><span class="test_status">' + (passed && 'passed' || 'failed') + '</span>';
    el.appendChild(name_el);

    if (typeof message !== 'undefined') {
      var message_el = document.createElement('div');
      message_el.className = 'test_message';
      message_el.innerHTML = message;
      el.appendChild(message_el);
    }

    this.el.appendChild(el);
  },

  expand_test_obj: function (test_obj, test_key, level) {
    if (typeof test_obj === 'function') {
      try {
        test_obj(test_suite.test_vars);
        this.create_result(test_key, true, level);
      } catch (e) {
        this.create_result(test_key, false, level, e.message);
      }
    } else {
      this.create_cat(test_key, level);
      for (var new_key in test_obj) {
        this.expand_test_obj(test_obj[new_key], new_key, level + 1);
      }
    }
  },

  run_tests: function () {
    this.init();

    var test_key = 'tests';
    var test_obj = test_suite.tests;
    this.expand_test_obj(test_obj, test_key, 0);
  }
};

window.addEventListener('load', function () {
  test_suite_runner.run_tests();
});