var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var EpubGenerator = require('epub-generator');
var fs = require('fs');

gulp.task('build', function() {
    var generatorStream = EpubGenerator({
        title: "Бегай быстро и без травм",
        author: "Гордон Пири",
        language: 'ru'
    });
    generatorStream.on('error', function(err){
        console.trace(err);
    });
    
    generatorStream.add('cover.html', fs.createReadStream('src/cover.html'),
        {mimetype: 'application/xhtml+xml', toc: false, title: 'Обложка'});
    generatorStream.add('biography.html', fs.createReadStream('src/1-biography.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'Биографическая справка'});
    generatorStream.add('foreword.html', fs.createReadStream('src/2-foreword.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'Вступление'});
    generatorStream.add('thanks.html', fs.createReadStream('src/3-foreword.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'Благодарности'});
    generatorStream.add('intro.html', fs.createReadStream('src/4-introduction.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'Предисловие'});
    generatorStream.add('rules.html', fs.createReadStream('src/5-introduction.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'ПРАВИЛА БЕГА ГОРДОНА ПИРИ'});

    generatorStream.add('ch1.html', fs.createReadStream('src/chapter-1.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'ГЛАВА ПЕРВАЯ - ВВЕДЕНИЕ'});
    generatorStream.add('ch2.html', fs.createReadStream('src/chapter-2.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'ГЛАВА ВТОРАЯ – ПРИЧИНЫ СПОРТИВНЫХ НЕУДАЧ'});
    generatorStream.add('ch3.html', fs.createReadStream('src/chapter-3.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'ГЛАВА ТРЕТЬЯ – ТРАВМЫ, ТЕХНИКА, ОБУВЬ'});
    generatorStream.add('ch4.html', fs.createReadStream('src/chapter-4.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'ГЛАВА ЧЕТВЕРТАЯ - ТРЕНИРОВКА'});
    generatorStream.add('ch5.html', fs.createReadStream('src/chapter-5.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'ГЛАВА ПЯТАЯ – СИЛОВАЯ ПОДГОТОВКА'});
    generatorStream.add('ch6.html', fs.createReadStream('src/chapter-6.html'),
        {mimetype: 'application/xhtml+xml', toc: true, title: 'ГЛАВА ШЕСТАЯ – ДИЕТА И ВИТАМИНЫ '});

    var images = gulp.src(['src/*.png']);

    images.on('readable', function() {
        var i;
        while (null !== (i = images.read())) {
            var name = i.path.substr(i.base.length);
            generatorStream.add(name, fs.createReadStream(i.path), {mimetype: "image/png"})
        }
    });

    images.on('end', function () {
        generatorStream.end()
            .pipe(fs.createWriteStream('basic.epub'));
    });
});

gulp.task('dev', ['browser-sync']);
gulp.task('browser-sync', function() {
    var s = '<script type="text/javascript" id="__bs_script__">' +
            'var el = document.createElement("script");' +
            'el.setAttribute("async", "");' +
            'el.setAttribute("src", "/browser-sync/browser-sync-client.2.7.10.js");' +
            'document.head.appendChild(el);' +
            '</script>';
    browserSync.init({
        server: {
            baseDir: "src",
            directory: true
        },
        files: ["**/*.html", "**/*.css", "**/*.png"],
//        logLevel: "debug",
        snippetOptions: {

            // Ignore all HTML files within the templates folder
            ignorePaths: "templates/*.html",

            // Provide a custom Regex for inserting the snippet.
            rule: {
                match: /<\/body>/i,
                fn: function (snippet, match) {
                    return s + match;
                }
            }
        }
    });
});
