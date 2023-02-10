import os
import sys
sys.path.append('..')
from pathlib import Path
import pandas as pd

from entry import socketio
from api.utils import winapi_path, sort_nicely


class DirectorySize:

    def __init__(self, directory):
        self.directory = directory
        self._stats = {}
        self._extensions = {}

    @property
    def stats(self):
        return self._stats

    @property
    def extensions(self):
        return self._extensions

    def get_directory_size(self):
        def _recursive_func(directory):
            total = 0
            for entry in os.scandir(directory):
                if entry.is_dir():
                    _recursive_func(entry.path)
                    total += parent_size[entry.path]
                else:
                    size = entry.stat().st_size
                    total += size
                    file_size[entry.path] = size

            parent_size[directory] = total
            self._stats = {
                'total_size': sum(file_size.values()),
                'file_count': len(file_size),
                'directory_count': len(parent_size)
            }
            socketio.emit('space-utilization', self._stats)

        file_size = {}
        parent_size = {}

        _recursive_func(self.directory)

        # Get extension info
        extensions = {}
        for fname, size in file_size.items():
            ext = os.path.splitext(fname)[-1]
            if ext == '':
                ext = '.'

            try:
                extensions[ext]['bytes'] += size
                extensions[ext]['count'] += 1
            except KeyError:
                extensions[ext] = {'bytes': 0, 'count': 0}
                extensions[ext]['bytes'] += size
                extensions[ext]['count'] += 1

        # Format extension info
        extension_info = []
        for key in extensions:
            size = extensions[key]['bytes']
            count = extensions[key]['count']

            extension_info.append({
                'extension': key,
                'bytes': size,
                'perc_bytes': round(size/self._stats['total_size']*100, 1),
                'count': count,
                'perc_count': round(count/self._stats['file_count']*100, 1)
            })

        extension_info = sorted(extension_info, key=lambda item: item['bytes'], reverse=True)
        self._extensions = extension_info.copy()

        return file_size, parent_size

    def _get_relative_path(self, path):
        """Return path relative to directory attribute."""
        return str(Path(path).relative_to(Path(self.directory).parent))

    def _get_parent_path(self, path):
        """Determine if path is top or not, then determine parent path."""
        if path == os.path.split(self.directory)[1]:
            return path
        return os.path.split(path)[0]

    def get_dataframe(self):
        """
        Return a dataframe containing data needed for treemap chart.
        """
        file_size, parent_size = self.get_directory_size()

        directory_tree = {**parent_size, **file_size}
        directory_tree = {i: directory_tree[i] for i in sort_nicely(directory_tree)}

        result = []
        for key, value in directory_tree.items():
            parent = self._get_relative_path(self._get_parent_path(key))
            label = str(Path(key).name)
            size = value
            ids = self._get_relative_path(key)

            result.append({'parents': parent, 'labels': label, 'size': size, 'ids': ids})

        df = pd.DataFrame(result)

        # Get first folder
        df.loc[df.index == 0, 'parents'] = ''

        return df

    @staticmethod
    def get_plotdata(df):
        labels = df['labels'].tolist()
        parents = df['parents'].tolist()
        ids = df['ids'].tolist()
        values = df['size'].tolist()
        return {'labels': labels, 'parents': parents, 'ids': ids, 'values': values}
