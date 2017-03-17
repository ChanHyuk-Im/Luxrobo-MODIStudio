LUXROBO RoT IDE
===============

현재는 kickstarter를 위해서 개발되고 있다.
LUXROBO Module과의 연동을 위한 Software 통합 개발 환경이다.

## Dependency

* npm
	* [https://nodejs.org/](https://nodejs.org/)
* bower
	> `$ npm install -g bower`
	
* gulp
	> `$ npm install -g gulp`

npm이 기본적으로 설치되어 있어야하며, `npm`명령을 실행할 수 있는 환경에서 이하 작업들을 진행할 것을 권장

## Configure

실행하기 전에 git root directory에서 관련 명령어들을 입력하여 기본 설정을 해주어야 한다.

1. Configure node
	> `$ npm install`
	
2. Configure bower
	> `$ bower install`
	

## HOW TO USE

`$ gulp browser`

명령을 실행하면 기본적인 라이브러리가 로드되며, 실시간 불러오기가 가능하도록 바뀐다. live reload 기능이 기본적으로 내장되어 있고, 자동적으로 크롬 브라우져가 실행되기 때문에 chrome을 사용하여, 실시간 확인하면서 작업할 수 있다.

`$ gulp electron`

명령을 사용하면 기본적인 개발이 가능하도록 불러와지며, electron을 사용하여 구동될 수 있도록 준비가 된다. 이 역시 livereload를 지원한다.

`$ gulp cordova-android`

> **이 작업을 수행하기 전에 `$ gulp cordova-create`명령을 먼저 수행해 주어야 한다**

명령을 실행하면 기본적인 라이브러리가 로드되며, 실시간 불러오기가 가능하도록 바뀐다. live reload 기능이 기본적으로 내장되어 있고, 자동적으로 코도바 브라우져가 실행되기 때문에 real android phone을 사용하여, 실시간 확인하면서 작업할 수 있다.

## Directory

* dist: build된 파일 위치, 실제 배포할 파일들이 여기 위치하게 된다
* src : html, javascript, css등의 가공되기 전의 소스

기본적으로 src에서 작업하며, `gulp`명령으로 실시간으로 생성되는 dist 폴더를 확인하며 작업한다.

## Development Guide

* wiki에 전체 개발에 대한 참고사항이 있으니, **무조건** 먼저 읽어보고 작업할 것
	* [official branch list](https://git.luxrobo.com/IDE/production/wikis/officialBrunchList#official-brunch-list)