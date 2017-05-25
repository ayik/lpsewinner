var should = require('should');
var url = 'http://lpse.jemberkab.go.id';
var EprocScraper = require('../index');
var nock = require('nock');

describe('e-Proc Scraper', function() {
  nock(url)
    .filteringPath(function(path){
      return path;
    })
    .get('/eproc/lelang')
    .replyWithFile(200, __dirname + '/assets/lelang-1.html');

  nock(url)
    .filteringPath(function(path){
      if (path.indexOf('/eproc/lelang.gridtable.pager') === 0) {
        return '/eproc/lelang.gridtable.pager';
      } else {
        return path;
      }
    })
    .get('/eproc/lelang.gridtable.pager')
    .replyWithFile(200, __dirname + '/assets/lelang-1.html');

  nock(url)
    .filteringPath(function(path){
      if (path.indexOf('/eproc/lelang/tahap') === 0) {
        return '/eproc/lelang/tahap';
      } else {
        return path;
      }
    })
    .get('/eproc/lelang/tahap')
    .times(50)
    .replyWithFile(200, __dirname + '/assets/lelang-4.html');

  nock(url)
    .filteringPath(function(path){
      if (path.indexOf('/eproc/lelang.gridtable.pager') === 0) {
        return '/eproc/lelang.gridtable.pager';
      } else {
        return path;
      }
    })
    .get('/eproc/lelang.gridtable.pager')
    .replyWithFile(200, __dirname + '/assets/lelang-1.html');

  nock(url)
    .filteringPath(function(path){
      if (path.indexOf('/eproc/lelang/tahap') === 0) {
        return '/eproc/lelang/tahap';
      } else {
        return path;
      }
    })
    .get('/eproc/lelang/tahap')
    .times(50)
    .replyWithFile(200, __dirname + '/assets/lelang-4.html');


  nock(url)
    .get('/eproc/publiclelangumum.grid.pager/0')
    .replyWithFile(200, __dirname + '/assets/lelang-2.html');

  nock(url)
    .get('/eproc/lelang/pemenangcari.gridtable.pager/0')
    .replyWithFile(200, __dirname + '/assets/lelang-3.html');
  
  nock(url)
    .filteringPath(/\/eproc\/rekanan\/lelangpeserta\/[^&]*/g, '/eproc/rekanan/lelangpeserta/29931127')
    .get('/eproc/rekanan/lelangpeserta/29931127')
    .times(50)
    .replyWithFile(200, __dirname + '/assets/lelang-5.html');
  nock(url)
    .filteringPath(/\/eproc\/lelang\/view\/[^&]*/g, '/eproc/rekanan/lelangpeserta/29931127')
    .get('/eproc/rekanan/lelangpeserta/29931127')
    .times(50)
    .replyWithFile(200, __dirname + '/assets/lelang-6.html');

  it('should return number of pages in lelang', function(done) {
    var L = new EprocScraper(url + '/eproc');
    L.lelangPages().then(function(pages) {
      pages.should.equal(415);
      done();
    });
  });

  it('should return packages', function(done) {
    var L = new EprocScraper(url + '/eproc');
    L.lelang().then(function(packages) {
      packages.length.should.equal(50);
      done();
    });
  });

  it('should return page 2 of packages', function(done) {
    var L = new EprocScraper(url + '/eproc');
    L.lelang(2).then(function(packages) {
      packages.length.should.equal(50);
      done();
    });
  });

  it('should return packages for "lelang umum non-eproc"', function(done) {
    var L = new EprocScraper(url + '/eproc');
    L.lelangUmum().then(function(packages) {
      packages.length.should.equal(50);
      for (var i = 0; i < packages.length; i++) {
        var p = packages[i];
        p.link.indexOf(p.id).should.equal(p.link.length - p.id.length);
      }
      done();
    });
  });

  it('should return the winning bidders', function(done) {
    this.timeout(50000);
    var L = new EprocScraper(url + '/eproc');
    L.pemenang().then(function(winners) {
      console.log(winners);
      winners.length.should.equal(30);
      for (var i = 0; i < winners.length; i++) {
        var p = winners[i];
        p.winner.name.length.should.greaterThan(0);
        p.link.indexOf(p.id).should.equal(p.link.length - p.id.length);
      }
      done();
    });
  });


});
