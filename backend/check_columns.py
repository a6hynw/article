import pandas as pd

df = pd.read_csv('data/processed/articles_processed.csv')
print('Columns:')
print(df.columns.tolist())
print('\nDataFrame info:')
print(df.info())
print('\nFirst 2 rows:')
print(df.head(2))
