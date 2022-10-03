## Basic CLI for extracting meta data from GoPro Videos
### Prerequisites
This CLI uses ffmpeg and ffprobe, which are not included in this package.

You must have ffmpeg and ffprobe installed on your system, and you must set your system `PATH` environment variable to include the
path to the ffmpeg and ffprobe executables.

They can be found on [ffmpeg's downloads page](https://ffmpeg.org/download.html).

### Installation
Install with `npm i -g extract-goprodata`.

Global installation is necessary for the CLI to be used in any directory in the terminal.

### Usage
In terminal shell, use `extract-goprodata --input path/to/video-name [--format output-format] [--name name-within-gpx-file] [--output path/to/file-name]`.

Telemetry output format:
Formats can be any of those found at [JuanIrache/gopro-telemetry](https://github.com/JuanIrache/gopro-telemetry#presets). Returns a JSON formatted document if specified format is not valid.

Alternatively, use:
- `-i` instead of `--input`
- `-f` instead of `--format`
- `-n` instead of `--name`
- `-o` instead of `--output`


- `--format` defaults to `gpx`.
- `--output` defaults to the name of the input file, using the format for the extension.
- `--name` defaults to input file name.

Only some file formats include the `--name` string within the file, eg gpx.

> Don't add the file extension to the `--output` name.

If your GPX file contains no points, it is likely that the camera did not have a GPS lock when you started recording. 
GPX points are only recorded if the device has a GPS lock, which can take a minute or longer on device start up.

### Credit
- ffmpeg
- fluent-ffmpeg/node-fluent-ffmpeg
- ffprobe
- ScottyFillups/ffprobe-client
- JuanIrache/gopro-telemetry
- yargs/yargs
