// Generated by CoffeeScript 1.3.3
(function() {

  window.addEvent('domready', function() {
    var Dimension, DimensionCollectionView, DimensionView, Host, HostCollection, Metric, MetricCollection, button, hosts, hostsContainer, hostsView, metrics, metricsContainer, metricsView;
    Dimension = Backbone.Model.extend({
      defaults: {
        checked: false,
        display: true
      }
    });
    Host = Dimension.extend({});
    Metric = Dimension.extend({});
    HostCollection = Backbone.Collection.extend({
      url: '/data',
      model: Host,
      parse: function(response) {
        var attrs;
        return attrs = response.hosts.map(function(host) {
          return {
            id: host
          };
        });
      },
      filter: function(term) {
        return this.each(function(item) {
          var match;
          match = !!item.get('id').match(term);
          return item.set('display', match);
        });
      }
    });
    MetricCollection = Backbone.Collection.extend({
      url: '/data/*',
      model: Metric,
      parse: function(response) {
        var attrs;
        attrs = response.metrics.map(function(metric) {
          return {
            id: metric
          };
        });
        return _.sortBy(attrs, function(attr) {
          return attr.id;
        });
      },
      filter: function(term) {
        return this.each(function(item) {
          var match;
          match = !!item.get('id').match(term);
          return item.set('display', match);
        });
      }
    });
    DimensionView = Backbone.View.extend({
      tagName: 'li',
      className: 'row',
      render: function() {
        var checkbox, id, label, name, that;
        that = this;
        id = name = this.model.id;
        checkbox = new Element('input', {
          'type': 'checkbox',
          'id': id,
          'class': "" + name + " checkbox",
          'checked': this.model.get('checked'),
          'events': {
            'change': function(event) {
              return that.model.set('checked', !that.model.get('checked'));
            }
          }
        });
        label = new Element('label', {
          'for': id,
          'html': id,
          'class': "" + name + " label"
        });
        $(this.el).grab(checkbox);
        $(this.el).grab(label);
        return $(this.el).addEvent('click', function(event) {
          if (event.target.tagName.toLowerCase() === 'li') {
            checkbox = event.target.getElement('input.checkbox');
            if (checkbox) {
              checkbox.checked = !checkbox.checked;
            }
            return that.model.set('checked', !that.model.get('checked'));
          }
        });
      }
    });
    DimensionCollectionView = Backbone.View.extend({
      tagName: 'ul',
      className: 'dimensioncollection',
      initialize: function() {
        var container, search, that;
        that = this;
        container = $(that.options.container);
        search = new Element('input', {
          'type': 'text',
          'class': 'search',
          'autocomplete': 'off',
          'events': {
            'keyup': function(event) {
              var list, term;
              term = event.target.value;
              that.collection.filter(term);
              list = that.render().el;
              return container.grab(list);
            }
          }
        });
        return container.grab(search);
      },
      render: function() {
        var message, that;
        that = this;
        that.el.empty();
        that.collection.each(function(model) {
          var view;
          view = new DimensionView({
            model: model
          });
          if (model.get('display')) {
            return that.el.grab(view.render());
          }
        });
        if (that.el.getChildren().length === 0) {
          message = new Element('li', {
            'html': 'No matches',
            'class': 'row'
          });
          that.el.grab(message);
        }
        return that;
      }
    });
    hostsContainer = $('hosts');
    hosts = new HostCollection;
    hostsView = new DimensionCollectionView({
      collection: hosts,
      container: hostsContainer
    });
    hosts.fetch({
      success: function(collection) {
        var list;
        list = hostsView.render().el;
        return hostsContainer.grab(list);
      }
    });
    metricsContainer = $('metrics');
    metrics = new MetricCollection;
    metricsView = new DimensionCollectionView({
      collection: metrics,
      container: metricsContainer
    });
    metrics.fetch({
      success: function(collection) {
        var list;
        list = metricsView.render().el;
        return metricsContainer.grab(list);
      }
    });
    button = new Element('input', {
      'type': 'button',
      'value': 'Show graphs',
      'class': 'button',
      'styles': {
        'font-size': '80%',
        'padding': '4px 8px'
      },
      'events': {
        'click': function(event) {
          console.log('hosts', hosts.where({
            checked: true
          }));
          return console.log('metrics', metrics.where({
            checked: true
          }));
        }
      }
    });
    return $('display').grab(button);
  });

}).call(this);