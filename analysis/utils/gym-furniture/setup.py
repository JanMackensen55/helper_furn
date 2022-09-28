from setuptools import setup

setup(name='gym_furniture',
      version='0.1',
      include_package_data=True,
      package_data={
        '': ['*.lp'],
      },
      install_requires=['gym', 'numpy', 'pygame'])
