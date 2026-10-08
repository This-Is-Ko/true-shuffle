pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS_ID = 'ebada74c-369a-4159-b094-49de68784b7b'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/This-Is-Ko/true-shuffle'
            }
        }

        stage('Read application version') {
            steps {
                dir('backend') {
                    script {
                        env.APP_VERSION = sh(
                            script: """
                            python3 - << 'EOF'
from app.__version__ import __version__
print(__version__)
EOF
                            """,
                            returnStdout: true
                        ).trim()

                        echo "Detected application version: ${env.APP_VERSION}"

                        env.FLASK_TAG  = "true_shuffle_flask-${env.APP_VERSION}"
                        env.CELERY_TAG = "true_shuffle_celery_worker-${env.APP_VERSION}"

                        env.DOCKER_HUB_IMAGE_FLASK  = "kobo67/true-shuffle:${env.FLASK_TAG}"
                        env.DOCKER_HUB_IMAGE_CELERY = "kobo67/true-shuffle:${env.CELERY_TAG}"
                    }
                }
            }
        }

        stage('Set up Python environment') {
            steps {
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        ./venv/bin/pip install --upgrade pip
                        ./venv/bin/pip install -r ./app/requirements.txt
                        ./venv/bin/pip install pytest
                    '''
                }
            }
        }

        stage('Run tests') {
            steps {
                dir('backend') {
                    sh './venv/bin/pytest'
                }
            }
        }

        stage('Docker availability check') {
            steps {
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Build Docker images') {
            steps {
                dir('backend') {
                    sh '''
                        docker-compose -f docker-compose-prod.yml build --no-cache --pull
                    '''
                }
            }
        }

        stage('Push Docker images') {
            steps {
                script {
                    docker.withRegistry('', DOCKER_HUB_CREDENTIALS_ID) {
                        sh "docker push ${DOCKER_HUB_IMAGE_FLASK}"
                        sh "docker push ${DOCKER_HUB_IMAGE_CELERY}"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Build and push successful for version ${env.APP_VERSION}"
        }
        failure {
            echo "Build or push failed"
        }
    }
}
