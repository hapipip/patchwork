'use strict';

const Lab =  require('lab');
const Pellmell = require('../lib');
const Path = require('path');
const {expect} = require('code');
const {describe, it} = exports.lab = Lab.script();

describe('Test manifest building', () => {

  it('should merge simple pieces', done => {

    const pieces = [
      {a: 1, c: 3},
      {b: 2},
      () => ({c: 42})
    ];

    const result = Pellmell.patch(pieces);

    expect(result).to.equal({
      a: 1,
      b: 2,
      c: 3
    });
    done()
  });

  it('should merge simple pieces (with factory option)', done => {

    const pieces = [
      {a: 1, c: 3},
      {b: 2},
      param => ({c: 41 + param})
    ];

    const result = Pellmell.patch(pieces, {factory: [1]});

    expect(result).to.equal({
      a: 1,
      b: 2,
      c: 42
    });
    done()
  });

  it('should transform one directory of config files to a single object', done => {

    const result = Pellmell.patch(__dirname + '/fixtures/test1', {factory: true});

    expect(result).to.equal({
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
    });

    done()
  });

  it('should merge multiple files/directories of config files to a single object', done => {


    let result = Pellmell.patch([
      Path.join(__dirname, 'fixtures', 'test1'),
      Path.join(__dirname, 'fixtures', 'test2')
    ], {factory: true});

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
      Path.join(__dirname, 'fixtures', 'test3.js')
    ], {factory: true});


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

  it('should merge mixed pieces to a single object', done => {


    let result = Pellmell.patch([
      Path.join(__dirname, 'fixtures', 'test1'),
      {a: 1},
      {a: 2},
      () => ({b: {bb: 42}})
    ], {factory: true});

    expect(result).to.equal({
      a: 2,
      b: {
        ba: {
          baa: {
            baaa: 'foo'
          },
          bab: {baba: 'cool'}
        },
        bb: 42
      }
    });



    result = Pellmell.patch([
      Path.join(__dirname, 'fixtures', 'test1'),
      Path.join(__dirname, 'fixtures', 'test2'),
      Path.join(__dirname, 'fixtures', 'test3.js')
    ], {factory: true});

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
      Path.join(__dirname, 'fixtures', 'test3.js')
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

  it('should work with or without trailing slash (issue#1)', done => {

    let result = Pellmell.patch([
      Path.join(__dirname, '/fixtures/test1/'),
      Path.join(__dirname, '/fixtures/test2')
    ], {factory: true});

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
    done();
  });
});
