import os
import sys
sys.path.append('..')
import time
import datetime
import fnmatch
import collections
from pathlib import Path

from entry import socketio
from api.utils import winapi_path, sort_nicely


def find_files_and_delete(folders, extensions, dry_run=True):
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

    return sort_nicely(list(files.keys()))


def delete_files(files):
    # Start timer.
    t0 = time.time()

    dirs = 0
    stats = collections.defaultdict(int)

    for fpath in files:
        try:
            stats[fpath] = os.path.getsize(fpath)
        except FileNotFoundError:
            fpath = winapi_path(fpath)
            stats[fpath] = os.path.getsize(fpath)

        try:
            Path(fpath).unlink()
        except FileNotFoundError:
            pass

        t1 = time.time()
        hours, minutes, seconds = str(datetime.timedelta(seconds=(t1-t0))).split(':')

        socketio.emit("cleanup", {
            'directory': dirs,
            'size': sum(stats.values()),
            'files': len(stats),
            'time': f'{hours}:{minutes}:{round(float(seconds), 1)}'
            })
