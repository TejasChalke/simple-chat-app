pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }

        // stage('Test') {
        //     steps {
        //         script {
        //         }
        //     }
        // }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker compose up -d --build'
                }
            }
        }
    }
}
