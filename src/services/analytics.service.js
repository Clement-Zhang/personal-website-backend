import { analytics } from '../configs/mongo.config.js';
import { ObjectId } from 'mongodb';

export const addOneUser = async (user) => await analytics.insertOne(user);

export const getAllUsers = async () =>
    await analytics
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
    let temp = await analytics
        .aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }])
        .toArray();
    temp.forEach(
        (genderCount) => (template[genderCount._id] = genderCount.count),
    );
    temp = await analytics
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
        .toArray();
    temp.forEach((ageCount) => (template[ageCount._id] = ageCount.count));
    return template;
}

export async function updateUser(updatedUser) {
    const { id, ...fields } = updatedUser;
    await analytics.updateOne({ _id: new ObjectId(id) }, { $set: fields });
}

export const deleteOneUser = async (id) =>
    await analytics.deleteOne({ _id: new ObjectId(id) });

export const deleteUsers = async () => await analytics.deleteMany();
