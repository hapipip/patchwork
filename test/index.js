'use strict';

const Lab =  require('lab');
const Pellmell = require('../lib/index');
const Path = require('path');
const {expect} = require('code');
const {describe, it, before} = exports.lab = Lab.script();

describe('Test manifest building', () => {

  it('should merge config files into one single object (from one path)', done => {

    const expected = {
      a: ['cat', 'dog', 'fish'],
      b: {
        ba: {
          baa: {
            baaa: 'foo'
          },
          bab: {baba: 'cool'}
        },
        bb: "meaning of life"
      }
    };

    const result = Pellmell.patch(__dirname + '/fixtures/test1');

    expect(result).to.equal(expected);
    done()
  });

  it('should merge config files into one single object (from multiple paths)', done => {

    const paths = [
      Path.join(__dirname, 'fixtures', 'test1'),
      Path.join(__dirname, 'fixtures', 'test2')
    ];

    let result = Pellmell.patch(paths);

    expect(result).to.equal({
      a: {aa: 1},
      b: {
        ba: {
          baa: {
            baaa: true
          },
          bab: {baba: 'cool'}
        },
        bb: {response: 42}
      }
    });



    result = Pellmell.patch([
      Path.join(__dirname, 'fixtures', 'test1'),
      Path.join(__dirname, 'fixtures', 'test2'),
      Path.join(__dirname, 'fixtures', 'test3')
    ]);

    expect(result).to.equal({
      a: {aa: 1},
      b: {
        ba: {
          baa: {
            baaa: true,
            baab: {
              "z": "foo",
              "y": "bar"
            }
          },
          bab: {baba: 'cool'}
        },
        bb: {response: 42}
      }
    });

    done()
  });

  //it('should merge config files into one single object (from multiple paths)', done => {
  it('should only return keys that match the mask if "sanitize" options is provided', done => {

    const mask = {
      b: {
        ba: {
          baa: {
            baab: {
              z: true
            }
          }
        }
      }
    };

    const result = Pellmell.patch([
      Path.join(__dirname, 'fixtures', 'test1'),
      Path.join(__dirname, 'fixtures', 'test2'),
      Path.join(__dirname, 'fixtures', 'test3')
    ], {sanitize: mask});

    expect(result).to.equal({
      b: {
        ba: {
          baa: {
            baab: {
              "z": "foo"
            }
          }
        }
      }
    });
    done()
  });

});
