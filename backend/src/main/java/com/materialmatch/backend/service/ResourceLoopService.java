package com.materialmatch.backend.service;

import com.materialmatch.backend.model.ResourceLoopRecommendation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResourceLoopService {

    public List<ResourceLoopRecommendation> getRecommendations(
            String materialName,
            String category) {

        List<ResourceLoopRecommendation> recommendations =
                new ArrayList<>();

        if (category == null || category.isBlank()) {
            return recommendations;
        }

        switch (category.trim().toLowerCase()) {

            case "textile":

                recommendations.add(
                        new ResourceLoopRecommendation(
                                materialName,
                                "Recycled textile fibres",
                                "Textile recycling industry",
                                "Suitable cotton or textile waste may be processed to recover reusable fibres.",
                                "Sorting, removal of contaminants and fibre processing",
                                "Potential option; composition and fibre condition must be checked",
                                "Verify contamination, fibre composition and product-specific safety requirements."
                        )
                );

                recommendations.add(
                        new ResourceLoopRecommendation(
                                materialName,
                                "Industrial wiping cloths",
                                "Industrial cleaning industry",
                                "Some clean, absorbent textile scraps may be converted into wiping cloths.",
                                "Sorting, cleaning and cutting",
                                "Potential option for suitable clean scraps",
                                "Exclude contaminated fabrics and verify suitability for the intended use."
                        )
                );

                recommendations.add(
                        new ResourceLoopRecommendation(
                                materialName,
                                "Textile-based insulation",
                                "Insulation manufacturing industry",
                                "Some textile fibres may be suitable for insulation products after processing.",
                                "Fibre preparation and appropriate product treatment",
                                "Requires technical testing",
                                "Fire performance, chemical content and applicable building standards must be assessed."
                        )
                );

                break;

            case "plastic":

                recommendations.add(
                        new ResourceLoopRecommendation(
                                materialName,
                                "Recycled plastic raw material",
                                "Plastic recycling industry",
                                "Compatible plastic waste may be reprocessed into material for new products.",
                                "Polymer identification, sorting, cleaning and reprocessing",
                                "Depends on polymer type and contamination",
                                "Verify polymer identity and exclude hazardous or incompatible waste."
                        )
                );

                break;

            case "wood":

                recommendations.add(
                        new ResourceLoopRecommendation(
                                materialName,
                                "Reclaimed wood products",
                                "Wood processing industry",
                                "Suitable clean wood offcuts may be reused in new wood products.",
                                "Inspection, removal of contaminants and cutting",
                                "Depends on wood condition",
                                "Check for chemical treatment, coatings, nails and other contaminants."
                        )
                );

                break;

            case "food":
            case "agricultural":

                recommendations.add(
                        new ResourceLoopRecommendation(
                                materialName,
                                "Composting",
                                "Composting and organic waste processing",
                                "Suitable uncontaminated organic material may be processed into compost.",
                                "Sorting and controlled biological processing",
                                "Depends on material composition",
                                "Check contamination and applicable waste-processing requirements."
                        )
                );

                break;

            case "metal":

                recommendations.add(
                        new ResourceLoopRecommendation(
                                materialName,
                                "Metal recovery and recycling",
                                "Metal recycling industry",
                                "Recoverable metal scrap may be processed into secondary metal feedstock.",
                                "Sorting, alloy identification and appropriate recycling",
                                "Depends on metal type and condition",
                                "Identify the metal and handle contaminated or hazardous scrap appropriately."
                        )
                );

                break;

            default:

                recommendations.add(
                        new ResourceLoopRecommendation(
                                materialName,
                                "Further material assessment",
                                "Suitable reuse or recycling industry",
                                "More information is needed to identify an appropriate reuse pathway.",
                                "Material identification and suitability assessment",
                                "Not yet determined",
                                "Do not assume the material is safe or suitable without appropriate assessment."
                        )
                );
        }

        return recommendations;
    }
}