/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function get() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const objectProto = Object.create(proto);
  const jsonObjectProperties = JSON.parse(json);
  return Object.assign(objectProto, jsonObjectProperties);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

  build: '',
  pseudoRepeat: false,
  idRepeat: false,
  elemRepeat: false,
  follow: '0',

  stringify() {
    return this.build;
  },

  errorRepeat() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  errorFollow() {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },

  element(value) {
    if (this.elemRepeat === true) { this.errorRepeat(); }
    const elementObject = Object.create(cssSelectorBuilder);
    elementObject.elemRepeat = true;
    const order = '1';
    if (order < +this.follow.slice(-1)) { this.errorFollow(); }
    elementObject.follow = this.follow + order;
    elementObject.build = this.build + value;
    return elementObject;
  },

  id(value) {
    if (this.idRepeat === true) { this.errorRepeat(); }
    const idObject = Object.create(cssSelectorBuilder);
    idObject.idRepeat = true;
    const order = '2';
    if (order < +this.follow.slice(-1)) { this.errorFollow(); }
    idObject.follow = this.follow + order;
    idObject.build = `${this.build}#${value}`;
    return idObject;
  },

  class(value) {
    const classObject = Object.create(cssSelectorBuilder);
    const order = '3';
    if (order < +this.follow.slice(-1)) { this.errorFollow(); }
    classObject.follow = this.follow + order;
    classObject.build = `${this.build}.${value}`;
    return classObject;
  },

  attr(value) {
    const attrObject = Object.create(cssSelectorBuilder);
    const order = '4';
    if (order < +this.follow.slice(-1)) { this.errorFollow(); }
    attrObject.follow = this.follow + order;
    attrObject.build = `${this.build}[${value}]`;
    return attrObject;
  },

  pseudoClass(value) {
    const pseudoClassObject = Object.create(cssSelectorBuilder);
    const order = '5';
    if (order < +this.follow.slice(-1)) { this.errorFollow(); }
    pseudoClassObject.follow = this.follow + order;
    pseudoClassObject.build = `${this.build}:${value}`;
    return pseudoClassObject;
  },

  pseudoElement(value) {
    if (this.pseudoRepeat === true) { this.errorRepeat(); }
    const pseudoElementObject = Object.create(cssSelectorBuilder);
    pseudoElementObject.pseudoRepeat = true;
    const order = '6';
    if (order < +this.follow.slice(-1)) { this.errorFollow(); }
    pseudoElementObject.follow = this.follow + order;
    pseudoElementObject.build = `${this.build}::${value}`;
    return pseudoElementObject;
  },

  combine(selector1, combinator, selector2) {
    const combineObject = Object.create(cssSelectorBuilder);
    combineObject.build = `${selector1.build} ${combinator} ${selector2.build}`;
    return combineObject;
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
