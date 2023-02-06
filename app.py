import os
import sys
import glob
import json
import time
import datetime
import fnmatch
import collections
from pathlib import Path
from flask import Flask, json, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
# from api.hogs import SpaceUsage
from api.utils import Worker, str2bool, read_file, sort_nicely, winapi_path
from api.archives import  create_archive, extract_files
from api.utilization import DirectorySize


app = Flask(__name__)
app_config = {"host": "0.0.0.0", "port": sys.argv[1]}
app.config['SECRET_KEY'] = 'secret'

# Set global object to store files and data
data = sys.modules[__name__]
data.DATA = {}

"""
---------------------- DEVELOPER MODE CONFIG -----------------------
"""
# Developer mode uses app.py
if "app.py" in sys.argv[0]:
    # Update app config
    app_config["debug"] = True

    # CORS settings
    cors = CORS(
        app,
        resources={r"/*": {"origins": "http://localhost*"}},
    )

    # CORS headers
    app.config["CORS_HEADERS"] = "Content-Type"

socketio = SocketIO(app, cors_allowed_origins='*')

"""
--------------------------- REST CALLS -----------------------------
"""
@app.route('/space-hogs', methods=['POST'])
def space_hogs():

    if request.method == 'POST':
        site = request.json

        dummy_last_update = '12/12/2022 (Sun) at 0832'
        dummy_allocation = 20000
        dummy_stats = [
            {'id': 0, 'user': 'Person 1', 'size': '100', 'util': '10', 'size_gt_year': '15', 'util_gt_year': '1', 'split_gt_year': '8'},
            {'id': 1, 'user': 'Person 2', 'size': '500', 'util': '12', 'size_gt_year': '19', 'util_gt_year': '4', 'split_gt_year': '23'},
            {'id': 2, 'user': 'Person 3', 'size': '232', 'util': '11.8', 'size_gt_year': '29', 'util_gt_year': '9', 'split_gt_year': '32'},
            {'id': 3, 'user': 'Person 4', 'size': '1000', 'util': '16', 'size_gt_year': '6', 'util_gt_year': '10', 'split_gt_year': '50'},
            ]

        return jsonify({
            'site': site,
            'last_update': dummy_last_update,
            'allocation': dummy_allocation,
            'stats': dummy_stats
        })


@app.route('/space-utilization', methods=['POST'])
def space_utilization():
    if request.method == 'POST':
        directory = DirectorySize(request.json)
        df = directory.get_dataframe()
        print('Space utilization complete...')
        return jsonify({'directory': directory.get_plotdata(df), 'extensions': directory.extension_info})


@app.route('/archive-files', methods=['POST'])
def archive_files():
    """Route for creating and extracting archive files.

    POST Parameters
    ---------------
    option : str, 'create' (default) or 'extract'
        Determines if archive files will be created or extracted from.

    paths : list of dictionaries
        List of dictionary objects containing the name of the file
        and the full path of the file.

    file_extension : str, '.tar' or '.tar.gz' (default)
        File extension when 'option=create'.

    remove_directory : bool, default is False
        Remove directory after the archive file has been created. This
        option is only used when 'option=create'.

    archive_format : str, 'PAX' (default) or 'GNU'
        Format of the archive file. This option is only used when
        'option=create'.

    search_criteria : str
        String containing all of the search criteria, separated by '\n'.

    output_directory : str, required
        Directory where the extract files will be stored. This option
        is only used when 'option=extract'.

    processors : int, default is 1
        Number of processors to use for multiprocessing.
    """

    if request.method == 'POST':

        if not request.json["paths"]:
            return jsonify(
                'No files or directories were provided. Drag and drop '
                'files or folders into the container and try again.'
                )

        # Initialize worker
        worker = Worker(workers=request.json['processors'])

        # Create
        if request.json['active_tab'] == 0:
            valid_folders = []
            for file in request.json['paths']:
                folder = file['path']
                if os.path.isdir(folder):
                    # Don't allow overwritting existing archive files
                    archive_filename = os.path.join(Path(folder).parent, Path(folder).name + request.json['file_extension'])

                    if os.path.isfile(archive_filename):
                        print(f'Cannot create {archive_filename!r} because it already exists. Skipping...')
                    else:
                        # Collect valid folders
                        valid_folders.append(folder)

                else:
                    print(f'Cannot create an archive file because {folder!r} is not a folder.')

            if valid_folders:
                # Start worker
                print('Creating archives...')
                worker.run(
                    create_archive,
                    valid_folders,
                    extension=request.json['file_extension'],
                    format=request.json['archive_format'],
                    remove_directory=str2bool(request.json['remove_directory'])
                    )
            else:
                print(f'No valid folders were provided, so archive files cannot be created.')

        # Extract
        elif request.json['active_tab'] == 1:

            output_directory = request.json['output_directory']

            if request.json['extract_option'] == 'files':
                search_criteria = request.json['search_criteria'].split('\n')
            else:
                search_criteria = None

            # Create output directory if it does not exist
            if not os.path.isdir(output_directory):
                os.makedirs(output_directory)

            valid_files = []

            for file in request.json['paths']:
                filename = file['path']

                if os.path.isfile(filename):
                    valid_files.append(filename)
                else:
                    print(f'Cannot extract from {filename!r} because it is not an archive file.')

            if valid_files:
                # Start worker
                print('Extracting files...')
                worker.run(
                    extract_files,
                    valid_files,
                    search_criteria=search_criteria,
                    output_path=output_directory
                    )
            else:
                print(f'No valid files were provided, so files cannot be extracted.')

        else:
            return jsonify('Only "create" and "extract" are supported at this time.')

    return jsonify('Archiving complete.')


@app.route('/load-files', methods=['POST'])
def load_files():
    """
    POST Parameters
    ---------------
    paths : list of dicts
        [{name: x1, path: y1}, ...]

    search_criteria: str, folder or file

    regex :

    skiprows :

    delimiter :

    sheets :

    """

    if request.method == 'POST':
        result = {'status': False, 'message': '', 'data': []}

        filepaths = request.json['paths']
        search_criteria = request.json['search_criteria']
        regex = request.json['regex']
        skiprows = request.json['skiprows']
        delimiter = request.json['delimiter']
        sheets = request.json['sheets']

        kwargs = {}
        if skiprows != '':
            kwargs['skiprows'] = skiprows
        if delimiter != '':
            kwargs['sep'] = delimiter
        if sheets != '':
            kwargs['sheet_name'] = sheets

        if not filepaths:
            result['message'] = """
            No files or dictionaries were provided. Drag
            and drop files or folders into the container
            and try again.
            """
            return jsonify(result)

        if search_criteria == 'folder':
            files = []
            for filepath in filepaths:
                files.extend(glob.glob(os.path.join(filepath['path'], regex), recursive=True))

            if not files:
                result['message'] = """
                No files were found in the folders provided with
                the regex input.
                """
                return jsonify(result)

        else:
            invalid_paths = []
            for filepath in filepaths:
                if not os.path.isfile(filepath['path']):
                    invalid_paths.append(False)

            if invalid_paths:
                result['message'] = """
                All files provided must be either all files or all
                directories, and they must exist. Make sure they are
                all either files or directories and that all of them
                exist.
                """
                return jsonify(result)

            files = [filepath['path'] for filepath in filepaths]

        for f in files:
            if f not in data.DATA:
                df = read_file(f, **kwargs)
                data.DATA[f] = {'df': df.to_dict(orient='list'), 'parameters': df.columns.tolist()}

        # Remove loaded data if files exist in loaded data, but not request
        data.DATA = {f: data.DATA[f] for f in files}

        files_and_parameters = [{'file': f, 'parameters': data.DATA[f]['parameters']} for f in data.DATA]

        result['status'] = True
        result['message'] = 'success'
        result['data'] = files_and_parameters

        # TODO: Confirm loading button stops loading if error occurs while
        #       loading files.
        return jsonify(result)


@app.route('/get-loaded-data')
def get_loaded_data():
    if data.DATA:
        print('FILES EXIST')
        return jsonify({
            'status': True,
            'message': 'success',
            'files': sorted(list(data.DATA.keys()))
        })
    print("NO FILES EXIST")
    return jsonify({
        'status': False,
        'message': 'No files have been loaded.',
        'files': []
    })


@app.route('/get-plot-data', methods=['POST'])
def get_plot_data():
    if request.method == 'POST':
        plot_data = []
        for row in request.json:
            plot_data.append({
                'x': data.DATA[row['file']]['df'][row['x']],
                'y': data.DATA[row['file']]['df'][row['y']],
                'name': row['name'],
                'type': 'scatter',
                'mode': row['mode']
            })
        return jsonify(plot_data)


@app.route('/delete-loaded-data', methods=['POST'])
def delete_loaded_data():
    if request.method == 'POST':
        data.DATA = {f: data.DATA[f] for f in request.json['paths']}
        return jsonify(sorted(list(data.DATA.keys())))


@socketio.on('cleanup')
@app.route('/cleanup', methods=['POST'])
def cleanup():
    if request.method == 'POST':
        dry_run = request.json['dry_run']

        folders = []
        for folder in request.json['folders']:
            folders.append(folder['path'])

        extensions = []
        for extension in request.json['extensions']:
            if extension['checked']:
                extensions.append(extension['file'])

        dirs = 0
        files = collections.defaultdict(int)

        # Start timer.
        t0 = time.time()

        for folder in folders:
            for i, (dirpath, dirnames, filenames) in enumerate(os.walk(folder), 1):
                dirs += 1

                if filenames:
                    for filename in filenames:
                        fpath = os.path.join(dirpath, filename)
                        if any(fnmatch.fnmatch(fpath, ext) for ext in extensions) and fpath not in files:
                            try:
                                files[fpath] = os.path.getsize(fpath)
                            except FileNotFoundError:
                                fpath = winapi_path(fpath)
                                files[fpath] = os.path.getsize(fpath)

                            # Skip removing files if dry run checkbox is checked
                            if not dry_run:
                                try:
                                    Path(fpath).unlink()
                                except FileNotFoundError:
                                    pass

                t1 = time.time()
                hours, minutes, seconds = str(datetime.timedelta(seconds=(t1-t0))).split(':')

                socketio.emit("cleanup", {
                    'directory': dirs,
                    'size': sum(files.values()),
                    'files': len(files),
                    'time': f'{hours}:{minutes}:{round(float(seconds), 1)}'
                    })

        return jsonify({'files': sort_nicely(list(files.keys()))})


#### Test function for socketio
@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    print()
    print('The client has successfully connected.')
    print('sid: ', request.sid)
    emit("connect", {"data": f"sid: {request.sid} is connected"})
    print()


@socketio.on('data')
def handle_message(data):
    """event listener when client types a message"""
    print()
    print("Data from the front end: ", str(data))
    emit("data", {'data': data, 'sid':request.sid}, broadcast=True)
    print()

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print()
    print("The client has been disconnected from the server")
    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)
    print()


@socketio.on('test-message')
@app.route('/test-counter', methods=['POST'])
def test_counter():
    if request.method == 'POST':
        print(request)
        count = 0
        for i in range(20):
            if i > 9:
                break
            count = i + 1
            socketio.emit("test-message", {'count': count})
            time.sleep(1)
        return jsonify(count)


"""
-------------------------- APP SERVICES ----------------------------
"""
# Quits Flask on Electron exit
@app.route("/quit")
def quit():
  shutdown = request.environ.get("werkzeug.server.shutdown")
  shutdown()

  return


if __name__ == "__main__":
#   app.run(**app_config)
  socketio.run(app, **app_config)
