import os
import pandas as pd
from pathlib import Path

whale_ids_file = 'whale_ids.csv'
def main():
    data = pd.read_csv(whale_ids_file)
    whale_ids = data['whale_ids'].tolist()
    base_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)),"SpermWhale_IDs\\")
    for ids in whale_ids:
        dir_path = os.path.join(base_dir,str(ids))
        if not os.path.exists(dir_path):
            try:
                os.makedirs(dir_path)
            except Exception as ex:
                print("Unable to create folder.",str(ex))
if __name__ == '__main__':
    main()
