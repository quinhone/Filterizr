import FilterItem from './FilterItem';

class FilterContainer {
  /**
   * Instantiates a FilterContainer
   * @param {String} selector of the FilterContainer instance
   * @param {Object} options with which to instantiate the container
   */
  constructor(selector = '.filtr-container', options) {
    // cache jQuery node
    this.$node = $(selector);

    // set props
    this.props = {
      // other props
      FilterItems: this.getFilterItems(options),
      w: this.getWidth(),
      h: 0,
    };

    // set up initial styles of container
    this.$node.css({
      'padding' : 0,
      'position': 'relative'
    });
  }

  /**
   * Destroys the FilterContainer instance by unbinding all events and resetting inline styles.
   */
  destroy() {
    // Remove all inline styles and unbind all events
    this.$node
      .attr('style', '')
      .find('.filtr-item')
      .attr('style', '');
    this.unbindEvents();
  }

  /**
   * Iterates over the FilterContainer creating FilterItem 
   * instances for every .filtr-item element found.
   */
  getFilterItems(options) {
    const FilterItems = $.map(this.$node.find('.filtr-item'), (item, index) => {
      return new FilterItem($(item), index, options);
    });

    return FilterItems;
  }

  /**
   * Pushes a new item into the FilterItem array in the properties of the FilterContainer
   */
  push($node, options) {
    const { FilterItems } = this.props;
    // Add new item to DOM
    this.$node.append($node);
    // Initialize it as a FilterItem and push into array
    const index = FilterItems.length;
    const filterItem = new FilterItem($node, index, options);
    this.props.FilterItems.push(filterItem);
  }

  /**
   * Calculates the amount of columns the Filterizr grid should have
   */
  calcColumns() {
    return Math.round(this.props.w / this.props.FilterItems[0].props.w);
  }

  /**
   * Updates the height of the FilterContainer prop and sets it as an inline style
   */
  updateHeight(newHeight) {
    this.props.h = newHeight;
    this.$node.css('height', newHeight);    
  }

  /**
   * Updates the width of the FilterContainer prop
   */
  updateWidth() {
    this.props.w = this.getWidth();
  }

  /**
   * Updates the dimensions of all FilterItems, used for resizing
   */
  updateFilterItemsDimensions() {
    const { FilterItems } = this.props;
    FilterItems.forEach(FilterItem => FilterItem.updateDimensions());
  }

  /**
   * Wrapper call around jQuery's innerWidth
   */
  getWidth() {
    return this.$node.innerWidth();
  }

  /**
   * Binds all Filterizr related events.
   * @param {Object} callbacks object containing all callback functions
   */
  bindEvents(callbacks) {
    this.$node.on('filteringStart.Filterizr', callbacks.onFilteringStart);
    this.$node.on('filteringEnd.Filterizr', callbacks.onFilteringEnd);
    this.$node.on('shufflingStart.Filterizr', callbacks.onShufflingStart);
    this.$node.on('shufflingEnd.Filterizr', callbacks.onShufflingEnd);
    this.$node.on('sortingStart.Filterizr', callbacks.onSortingStart);
    this.$node.on('sortingEnd.Filterizr', callbacks.onSortingEnd);
  }

  /**
   * Unbinds all Filterizr related events.
   */
  unbindEvents() {
    this.$node.off(
      `filteringStart.Filterizr 
      filteringEnd.Filterizr 
      shufflingStart.Filterizr 
      shufflingEnd.Filterizr 
      sortingStart.Filterizr 
      sortingEnd.Filterizr`
    );
  }

  /**
   * Method wrapper around jQuery's trigger
   * @param {string} evt name of the event
   */
  trigger(evt) {
    this.$node.trigger(evt);
  }
}

export default FilterContainer;
