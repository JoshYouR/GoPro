#! /usr/bin/env node

const ffmpeg = require('fluent-ffmpeg');
const ffprobe = require('ffprobe-client');
const _goproTelemetry = require('gopro-telemetry');
const {writeFile: _writeFile} = require('fs/promises');
const yargs = require('yargs');
const path = require('path');

const pipe = fns => x => fns.reduce((f, g) => g(f), x);

const get = string => object => object[string];

const filename = string => path.basename(string, path.extname(string));

const replaceExt = ext => string => path.join(path.dirname(string), `${filename(string)}.${ext}`)

const {input, output} = yargs.usage('extract-goprogpx [args]')
.option('input', {alias: 'i', describe: 'Set the input file path', type: 'string', demandOption: true})
.option('output', {alias: 'o', describe: 'Set the output file path. Don\'t include extension. Defaults to name of input file.', type: 'string'})
.argv;

const goproTelemetry = options => data => new Promise((res, rej) => _goproTelemetry(data, options, telemetry => res(telemetry)));

const writeFile = path => data => _writeFile(path, data);

const pipeP = promises => x => promises.reduce((f, g) => f.then(g), Promise.resolve(x));

const getCharAtIndex = index => string => string.charAt(index);

const getFirstChar = getCharAtIndex(0);

const getStreams = get('streams');

const getCodecTagString = get('codec_tag_string');

const getIndex = get('index');

const getId = pipe([
    get('id'),
    getFirstChar
]);

const find = predicate => array => array.find(predicate);


const isGpmdStream = stream => getCodecTagString(stream) === 'gpmd';

const findGoProMetaDataStream = find(isGpmdStream);

const getGpmdStreamIndex = url => pipeP([
    ffprobe,
    getStreams,
    findGoProMetaDataStream,
    stream => ({index: getIndex(stream), id: getId(stream)})
])(url);

const createGPSBinary = url => async ({index, id}) => {
                let buff = Buffer.alloc(0);
                return new Promise((res, rej) => ffmpeg(url)
                    .outputOptions(['-y', '-c copy', `-map ${id}:${index}`, '-f rawvideo'])
                    .on('error', rej)
                    .pipe()
                    .on('data', data => {buff = Buffer.concat([buff, data])})
                    .on('end', res)
                    ).then(() => ({rawData: buff}));
};

const run = inputPath => outputPath => pipeP([
    getGpmdStreamIndex,
    createGPSBinary(inputPath),
    goproTelemetry({preset: 'gpx', GPS5Fix: 2}),
    writeFile(`${outputPath || path.basename(inputPath, path.extname(inputPath))}.gpx`)
])(inputPath);

run(path.extname(input) === '' ? replaceExt('mp4')(input) : input)(output);