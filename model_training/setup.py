from setuptools import setup, find_packages

setup(name='gdsc_train',
      version='1.0',
      description='dsa',
      author='Hartvig',
      author_email='hartvig.johannson@capgemini.com',
      packages=find_packages(exclude=('tests', 'docs')))
