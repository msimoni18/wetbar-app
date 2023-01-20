import os
import re
import collections
from pathlib import Path
import pandas as pd


class DirectorySize:

    def __init__(self, directory):
        self.directory = directory
        self._file_size = None
        self._extension_size = None
        self._parent_size = None

    @property
    def extension_info(self):
        return self._extension_size

    @property
    def parent_info(self):
        return self._parent_size

    @property
    def file_info(self):
        return self._file_size

    def get_relative_path(self, path):
        """Return path relative to directory attribute."""
        return str(Path(path).relative_to(Path(self.directory).parent))

    def get_parent_path(self, path):
        """Determine if path is top or not, then determine parent path."""
        if path == os.path.split(self.directory)[1]:
            return path
        return os.path.split(path)[0]

    def get_directory_size(self):
        """
        Return a dictionary containing total size in bytes for all
        directories and files.
        """
        parents = []
        file_size = collections.defaultdict(int)
        extension_size = collections.defaultdict()
        parent_size = collections.defaultdict(int)
        total_count = 0
        total_size = 0

        for root, dirs, files in os.walk(self.directory):
            parents.append(str(Path(root)))
            for f in files:
                # Store file size
                f = os.path.join(root, f)
                fsize = os.path.getsize(f)
                file_size[str(Path(f))] += fsize

                # Store extension size
                ext = os.path.splitext(f)[-1]
                if ext == '':
                    ext = '.'

                if ext not in extension_size:
                    extension_size[ext] = {'bytes': 0, 'count': 0}

                extension_size[ext]['bytes'] += fsize
                total_size += fsize
                extension_size[ext]['count'] += 1
                total_count += 1

        # Calculate parent size
        for parent in parents:
            parent_split = re.split('\\\\|/', parent)

            slim_file_size = {}
            for filename, value in file_size.items():
                parent_for_file = re.split('\\\\|/', filename)[:len(parent_split)]
                if parent_split == parent_for_file:
                    slim_file_size[filename] = value

            parent_size[parent] += sum(slim_file_size.values())

        directory_tree = {**parent_size, **file_size}

        # Format extension info
        extension_info = []
        for key in extension_size:
            size = extension_size[key]['bytes']
            count = extension_size[key]['count']

            extension_info.append({
                'extension': key,
                'bytes': size,
                'perc_bytes': round(size/total_size*100, 1),
                'count': count,
                'perc_count': round(count/total_count*100, 1)
            })

        extension_info = sorted(extension_info, key=lambda item: item['bytes'], reverse=True)

        self._file_size = dict(file_size).copy()
        self._extension_size = extension_info.copy()
        self._parent_size = dict(parent_size).copy()

        return directory_tree

    def get_dataframe(self):
        """
        Return a DataFrame containing data needed for Treemap chart.
        """
        data = self.get_directory_size()

        result = []
        for key, value in data.items():
            parent = self.get_relative_path(self.get_parent_path(key))
            label = str(Path(key).name)
            size = value
            ids = self.get_relative_path(key)

            result.append({'parents': parent, 'labels': label, 'size': size, 'ids': ids})

        df = pd.DataFrame(result).sort_values(['parents', 'labels']).reset_index(drop=True)

        # Get first folder
        # df.loc[df.index == 0, 'ids'] = os.path.split(df.loc[0, 'ids'])[1]
        df.loc[df.index == 0, 'parents'] = ''

        return df

    @staticmethod
    def get_plotdata(df):
        labels = df['labels'].tolist()
        parents = df['parents'].tolist()
        ids = df['ids'].tolist()
        values = df['size'].tolist()
        return {'labels': labels, 'parents': parents, 'ids': ids, 'values': values}
