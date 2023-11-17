pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    // Your build commands here (e.g., npm install)
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Your test commands here
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Your Docker build and push commands here
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }
}
