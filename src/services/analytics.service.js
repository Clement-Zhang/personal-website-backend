import { analytics } from '../configs/mongo.config.js';
import { ObjectId } from 'mongodb';

export async function addOneUser(user) {
    return await analytics.insertOne(user);
}

export async function getAllUsers() {
    return await analytics
        .aggregate([
            //prettier-ignore
            {
                $addFields: {
                    age: {
                        $dateDiff: {
                            startDate: { $toDate: '$dob' },
                            endDate: '$$NOW',
                            unit: 'year',
                            timezone: '-04',
                        },
                    },
                    id: "$_id",
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
        ])
        .toArray();
}

export async function getAnalytics() {
    const template = {
        male: 0,
        female: 0,
        0: 0,
        15: 0,
        25: 0,
        55: 0,
        65: 0,
    };
    (
        await analytics
            .aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }])
            .toArray()
    ).forEach((genderCount) => (template[genderCount._id] = genderCount.count));
    (
        await analytics
            .aggregate([
                {
                    $bucket: {
                        groupBy: {
                            $dateDiff: {
                                startDate: { $toDate: '$dob' },
                                endDate: '$$NOW',
                                unit: 'year',
                                timezone: '-04',
                            },
                        },
                        boundaries: [0, 15, 25, 55, 65, 9999999999],
                    },
                },
            ])
            .toArray()
    ).forEach((ageCount) => (template[ageCount._id] = ageCount.count));
    return template;
}

export async function updateUser(updatedUser) {
    const { id, ...fields } = updatedUser;
    await analytics.updateOne({ _id: new ObjectId(id) }, { $set: fields });
}

export async function deleteOneUser(id) {
    await analytics.deleteOne({ _id: new ObjectId(id) });
}

export async function deleteUsers() {
    await analytics.deleteMany();
}