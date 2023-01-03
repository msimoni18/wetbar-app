import os
from pathlib import Path
import pandas as pd


class DirectorySize:

    def __init__(self, directory):
        self.directory = directory
    
    def get_parent_path(self, path):
        """Determine if path is top or not, then determine parent path."""
        if path == os.path.split(self.directory)[1]:
            return path
        return os.path.split(path)[0]
    
    def get_relpath(self, path):
        """Return path relative to directory attribute."""
        return Path(path).relative_to(Path(self.directory).parent)
    
    def calculate(self):
        result = []
        for root, dirs, files in os.walk(self.directory):
            relpath = self.get_relpath(root)
            newpar = self.get_parent_path(relpath)

            # Calculate directory size
            dir_size = sum(os.path.getsize(os.path.join(root, name)) for name in files)
            result.append({
                'parents': str(newpar),                   
                'labels': str(Path(root).name),
                'size': dir_size,
                'ids': str(relpath),
            })

            # Calculate individual file size
            for f in files:
                fp = os.path.join(root, f)
                relpath_fp = self.get_relpath(fp)
                newpar2 = self.get_parent_path(relpath_fp)

                result.append({
                    'parents': str(newpar2),       
                    'labels': str(Path(fp).name),
                    'size': os.path.getsize(fp),
                    'ids': str(relpath_fp),
                })

        return result
    
    def get_dataframe(self):
        result = self.calculate()
        df = pd.DataFrame(result)

        # Get first folder
        df.loc[df.index == 0, 'ids'] = os.path.split(df.loc[0, 'ids'])[1]
        
        return df

    def get_plotdata(self, df):
        labels = df['labels'].tolist()
        parents = df['parents'].tolist()
        ids = df['ids'].tolist()
        values = df['size'].tolist()
        return {'labels': labels, 'parents': parents, 'ids': ids, 'values': values}
