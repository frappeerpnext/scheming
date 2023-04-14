from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in scheming/__init__.py
from scheming import __version__ as version

setup(
	name="scheming",
	version=version,
	description="Sale Scheming",
	author="Tes Pheakdey",
	author_email="pheakdey.micronet@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
