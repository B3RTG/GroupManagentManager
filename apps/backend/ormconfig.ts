import { DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [
        'dist/**/entities/*.js',
        'src/**/entities/*.ts'
    ],
    synchronize: false,
    migrations: [
        'dist/migrations/*.js'
    ]
};

export default config;